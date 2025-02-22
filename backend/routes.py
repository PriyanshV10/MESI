from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends, Request
from datetime import datetime, timedelta
import io
import base64
import numpy as np
import cv2
import PIL.Image
from sqlalchemy.orm import Session
from models import Person, MessEntry
from schemas import BulkData
from utils import json_decode_encoding, get_current_meal, cosine_distance, load_faces_from_directory
from config import DETECTOR_BACKEND_REALTIME, RECOGNITION_MODEL_REALTIME, MATCH_THRESHOLD, DATABASE_PATH, DUPLICATE_ENTRY_THRESHOLD_MINUTES, DETECTOR_BACKEND_DB, RECOGNITION_MODEL_DB
from deepface import DeepFace
from database import SessionLocal
from pyzbar.pyzbar import decode
from fastapi.security import HTTPBasic, HTTPBasicCredentials
import os
import logging

router = APIRouter()
security = HTTPBasic()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def verify_admin(credentials: HTTPBasicCredentials = Depends(security)):
    if credentials.username != "admin@iiitkota.ac.in" or credentials.password != "adminpassword":
        raise HTTPException(status_code=401, detail="Unauthorized")
    return credentials.username

@router.post("/upload_frame")
async def upload_frame(request: Request, db: Session = Depends(get_db)):
    content_type = request.headers.get("content-type", "")
    now = datetime.utcnow()

    # Extract file content based on content type
    if "multipart/form-data" in content_type:
        form = await request.form()
        upload_file = form.get("file")
        if not upload_file:
            raise HTTPException(status_code=400, detail="No file uploaded")
        file_content = await upload_file.read()
    elif "application/json" in content_type:
        data = await request.json()
        img_base64 = data.get("image")
        if not img_base64:
            raise HTTPException(status_code=400, detail="No image provided")
        if img_base64.startswith("data:"):
            img_base64 = img_base64.split("base64,")[-1]
        try:
            file_content = base64.b64decode(img_base64)
        except Exception as e:
            raise HTTPException(status_code=400, detail="Image decoding error")
    else:
        raise HTTPException(status_code=400, detail="Unsupported content type")

    # Decode the image using PIL
    try:
        pil_image = PIL.Image.open(io.BytesIO(file_content)).convert("RGB")
    except Exception as e:
        raise HTTPException(status_code=400, detail="Image processing error")

    # Try barcode detection
    barcodes = decode(pil_image)
    if barcodes:
        barcode_data = barcodes[0].data.decode("utf-8")
        person = db.query(Person).filter(Person.college_id == barcode_data).first()
        meal = get_current_meal(now)
        if person:
            existing_entry = db.query(MessEntry).filter(
                MessEntry.person_id == person.id,
                MessEntry.meal_type == meal,
                MessEntry.entry_time >= now - timedelta(minutes=DUPLICATE_ENTRY_THRESHOLD_MINUTES)
            ).order_by(MessEntry.entry_time.asc()).first()
            if existing_entry is None:
                entry = MessEntry(person_id=person.id, entry_time=now, meal_type=meal, source="barcode")
                db.add(entry)
                db.commit()
            response = {
                "recognized": {
                    "name": person.name,
                    "category": person.category,
                    "college_id": barcode_data,
                    "entry_time": now.isoformat()
                },
                "source": "barcode"
            }
        else:
            response = {
                "recognized": {
                    "name": "Unknown",
                    "category": None,
                    "college_id": barcode_data,
                    "entry_time": now.isoformat()
                },
                "source": "barcode"
            }
        return response

    # If no barcode detected, convert PIL image to Numpy array for further processing.
    image = np.array(pil_image)

    # Convert the image to BGR format as required by the face recognition module
    if len(image.shape) == 3 and image.shape[2] == 3:
        image_bgr = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)
    elif len(image.shape) == 2 or (len(image.shape) == 3 and image.shape[2] == 1):
        image_bgr = cv2.cvtColor(image, cv2.COLOR_GRAY2BGR)
    else:
        raise HTTPException(status_code=400, detail="Invalid image format")

    # Extract face representations using DeepFace
    try:
        face_representations = DeepFace.represent(
            image_bgr,
            model_name=RECOGNITION_MODEL_REALTIME,
            detector_backend=DETECTOR_BACKEND_REALTIME,
            enforce_detection=False,
            align=True
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Face representation extraction failed: {e}")

    recognized = []
    meal = get_current_meal(now)
    
    # For each extracted face, find a matching person based on cosine distance
    for rep in face_representations:
        embedding = np.array(rep["embedding"])
        best_match = None
        best_distance = float("inf")
        all_people = db.query(Person).all()
        for person in all_people:
            known_encoding = json_decode_encoding(person.face_encoding)
            dist = cosine_distance(known_encoding, embedding)
            if dist < best_distance:
                best_distance = dist
                best_match = person
        if best_match and best_distance < MATCH_THRESHOLD:
            existing_entry = db.query(MessEntry).filter(
                MessEntry.person_id == best_match.id,
                MessEntry.meal_type == meal,
                MessEntry.entry_time >= now - timedelta(minutes=DUPLICATE_ENTRY_THRESHOLD_MINUTES)
            ).order_by(MessEntry.entry_time.asc()).first()
            if existing_entry is None:
                entry = MessEntry(person_id=best_match.id, entry_time=now, meal_type=meal, source="video")
                db.add(entry)
                db.commit()
                first_seen_time = now
            else:
                first_seen_time = existing_entry.entry_time
            recognized.append({
                "name": best_match.name,
                "category": best_match.category,
                "first_seen_time": first_seen_time.isoformat()
            })
        else:
            recognized.append({
                "name": "Unknown",
                "category": None,
                "first_seen_time": now.isoformat()
            })

    return {"recognized": recognized, "face_count": len(face_representations)}

@router.post("/enroll")
async def enroll(file: UploadFile = File(...), name: str = Form(...), category: str = Form(...), college_id: str = Form(None), db: Session = Depends(get_db)):
    file_content = await file.read()
    try:
        pil_image = PIL.Image.open(io.BytesIO(file_content)).convert("RGB")
        image = np.array(pil_image)
    except Exception as e:
        raise HTTPException(status_code=400, detail="Image processing error")
    if len(image.shape) == 3 and image.shape[2] == 3:
        image_bgr = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)
    elif len(image.shape) == 2 or (len(image.shape) == 3 and image.shape[2] == 1):
        image_bgr = cv2.cvtColor(image, cv2.COLOR_GRAY2BGR)
    else:
        raise HTTPException(status_code=400, detail="Invalid image format")
    try:
        representation = DeepFace.represent(
            image_bgr,
            model_name=RECOGNITION_MODEL_DB,
            detector_backend=DETECTOR_BACKEND_DB,
            enforce_detection=True,
            align=True
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Face representation extraction failed: {e}")
    if not representation:
        raise HTTPException(status_code=400, detail="No face detected")
    import numpy as np
    embedding = np.array(representation[0]["embedding"])
    from utils import json_encode_encoding
    encoding_str = json_encode_encoding(embedding)
    existing = db.query(Person).filter(Person.name == name).first()
    if existing:
        raise HTTPException(status_code=400, detail="Person already exists")
    folder = os.path.join(DATABASE_PATH, category)
    os.makedirs(folder, exist_ok=True)
    filename = f"{college_id+'-' if college_id else ''}{name}.jpg"
    file_path = os.path.join(folder, filename)
    with open(file_path, "wb") as f:
        f.write(file_content)
    person = Person(college_id=college_id, name=name, category=category, face_encoding=encoding_str)
    db.add(person)
    db.commit()
    return {"status": "Enrollment successful", "name": name}

@router.post("/bulk_data")
def bulk_data(data: list[BulkData], db: Session = Depends(get_db)):
    for record in data:
        entry = MessEntry(person_id=record.person_id, entry_time=record.entry_time, meal_type=record.meal_type, source=record.source)
        db.add(entry)
    db.commit()
    return {"status": "bulk data inserted"}

@router.post("/rfid")
def rfid_entry(rfid: str = Form(...), db: Session = Depends(get_db)):
    now = datetime.utcnow()
    meal = get_current_meal(now)
    person = db.query(Person).filter(Person.college_id == rfid).first()
    if not person:
        raise HTTPException(status_code=404, detail="RFID person not found")
    existing_entry = db.query(MessEntry).filter(
        MessEntry.person_id == person.id,
        MessEntry.meal_type == meal,
        MessEntry.entry_time >= now - timedelta(minutes=DUPLICATE_ENTRY_THRESHOLD_MINUTES)
    ).order_by(MessEntry.entry_time.asc()).first()
    if existing_entry is None:
        entry = MessEntry(person_id=person.id, entry_time=now, meal_type=meal, source="rfid")
        db.add(entry)
        db.commit()
    return {"status": "RFID entry logged", "name": person.name}

@router.get("/dashboard")
def dashboard(username: str = Depends(verify_admin), db: Session = Depends(get_db)):
    entries = db.query(MessEntry).all()
    result = []
    for entry in entries:
        person = db.query(Person).filter(Person.id == entry.person_id).first()
        result.append({"entry_id": entry.id, "person_id": entry.person_id, "name": person.name if person else "Unknown", "meal_type": entry.meal_type, "entry_time": entry.entry_time.isoformat(), "source": entry.source})
    return {"entries": result}

@router.get("/known_faces")
def get_known_faces(db: Session = Depends(get_db)):
    people = db.query(Person).all()
    result = []
    for person in people:
        result.append({"id": person.id, "college_id": person.college_id, "name": person.name, "category": person.category})
    return {"people": result}

@router.get("/recent_entries")
def recent_entries(db: Session = Depends(get_db)):
    threshold = datetime.utcnow() - timedelta(seconds=5)
    count = db.query(MessEntry).filter(MessEntry.entry_time >= threshold).count()
    return {"recent_count": count}

@router.get("/meal_summary")
def meal_summary(db: Session = Depends(get_db)):
    now = datetime.utcnow()
    meal = get_current_meal(now)
    entries = db.query(MessEntry).filter(MessEntry.meal_type == meal).all()
    total_entries = len(entries)
    summary = {}
    for entry in entries:
        summary[entry.person_id] = summary.get(entry.person_id, 0) + 1
    return {"meal": meal, "total_entries": total_entries, "details": summary}