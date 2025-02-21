import io
import numpy as np
import cv2
import PIL.Image
from datetime import datetime, timedelta
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from sqlalchemy.orm import Session
from models import Person, MessEntry
from schemas import BulkData
from utils import json_decode_encoding, get_current_meal, allowed_match, cosine_distance
from deepface import DeepFace

router = APIRouter()
security = HTTPBasic()

def get_db():
    from database import SessionLocal
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def verify_admin(credentials: HTTPBasicCredentials = Depends(security)):
    if credentials.username != "admin@iiitkota.ac.in" or credentials.password != "adminpassword":
        raise HTTPException(status_code=401, detail="Unauthorized")
    return credentials.username

# Global list of known people loaded from the database on startup.
known_people = []

@router.post("/upload_frame")
async def upload_frame(file: UploadFile = File(...), rfid: str = Form(None), db: Session = Depends(get_db)):
    contents = await file.read()
    # Open the image using PIL and convert it to an array.
    pil_image = PIL.Image.open(io.BytesIO(contents)).convert("RGB")
    image = np.array(pil_image)
    # Convert from RGB (PIL) to BGR (as expected by DeepFace and OpenCV)
    image_bgr = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)
    
    # Use DeepFace to extract face representations.
    # You may pass the BGR numpy array directly.
    try:
        face_representations = DeepFace.represent(image_bgr, model_name="Facenet", detector_backend="opencv", enforce_detection=False)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Face representation extraction failed: {e}")
    
    recognized = []
    now = datetime.utcnow()
    meal = get_current_meal(now)
    
    # Tunable threshold for cosine distance matching (lower means more strict)
    MATCH_THRESHOLD = 0.4
    
    for rep in face_representations:
        # Ensure the embedding is a numpy array.
        embedding = np.array(rep["embedding"])
        best_match = None
        best_distance = 1.0  # cosine distance (1 means completely dissimilar)
        for person in known_people:
            known_encoding = json_decode_encoding(person.face_encoding)
            # Compute cosine distance between enrolled face and detected face.
            dist = cosine_distance(known_encoding, embedding)
            if dist < best_distance:
                best_distance = dist
                best_match = person
        if best_match and best_distance < MATCH_THRESHOLD:
            # Avoid duplicate entries within the time threshold.
            if allowed_match(best_match.id, now, db):
                entry = MessEntry(person_id=best_match.id, entry_time=now, meal_type=meal, source="video")
                db.add(entry)
                db.commit()
            recognized.append({"name": best_match.name, "category": best_match.category})
        else:
            recognized.append({"name": "Unknown", "category": None})
    return {"recognized": recognized, "face_count": len(face_representations)}

@router.post("/bulk_data")
def bulk_data(data: list[BulkData], db: Session = Depends(get_db)):
    for record in data:
        entry = MessEntry(
            person_id=record.person_id, 
            entry_time=record.entry_time,
            meal_type=record.meal_type, 
            source=record.source
        )
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
    if allowed_match(person.id, now, db):
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
        result.append({
            "entry_id": entry.id,
            "person_id": entry.person_id,
            "name": person.name if person else "Unknown",
            "meal_type": entry.meal_type,
            "entry_time": entry.entry_time.isoformat(),
            "source": entry.source
        })
    return {"entries": result}

@router.get("/known_faces")
def get_known_faces(db: Session = Depends(get_db)):
    people = db.query(Person).all()
    result = []
    for person in people:
        result.append({
            "id": person.id,
            "college_id": person.college_id,
            "name": person.name,
            "category": person.category
        })
    return {"people": result}

# New endpoint for real-time count during the last 5 seconds.
@router.get("/recent_entries")
def recent_entries(db: Session = Depends(get_db)):
    from datetime import datetime, timedelta
    threshold = datetime.utcnow() - timedelta(seconds=5)
    count = db.query(MessEntry).filter(MessEntry.entry_time >= threshold).count()
    return {"recent_count": count}