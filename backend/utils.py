import os
import json
from datetime import datetime, time, timedelta
import numpy as np
from deepface import DeepFace
from models import Person, MessEntry
from database import SessionLocal

def json_encode_encoding(encoding):
    # Encoding is already a list (or numpy array converted to list)
    return json.dumps(encoding)

def json_decode_encoding(encoding_str):
    return np.array(json.loads(encoding_str))

def load_faces_from_directory(base_dir="faces"):
    db = SessionLocal()
    for category in ["students", "staff"]:
        folder_path = os.path.join(base_dir, category)
        if os.path.exists(folder_path):
            for file in os.listdir(folder_path):
                if file.lower().endswith((".jpg", ".jpeg", ".png")):
                    full_path = os.path.join(folder_path, file)
                    try:
                        # Extract face representation using DeepFace.
                        representations = DeepFace.represent(img_path=full_path, model_name="Facenet", detector_backend="opencv")
                        if not representations:
                            continue
                        encoding = representations[0]["embedding"]
                    except Exception as e:
                        print(f"Error processing {full_path}: {e}")
                        continue
                    # For student images, assume filename format "collegeid-name.jpg"
                    if category == "students":
                        if "-" not in file:
                            continue
                        college_id, name_ext = file.split("-", 1)
                        name = os.path.splitext(name_ext)[0]
                    else:
                        college_id = None
                        name = os.path.splitext(file)[0]
                    # Avoid duplicate enrollments
                    existing = db.query(Person).filter(Person.name == name).first()
                    if existing:
                        continue
                    person = Person(college_id=college_id, name=name, category=category, face_encoding=json_encode_encoding(encoding))
                    db.add(person)
            db.commit()
    db.close()

def get_current_meal(now: datetime):
    meals = {
        "Breakfast": (time(7, 30), time(9, 30)),
        "Lunch": (time(12, 0), time(14, 0)),
        "Snacks": (time(17, 0), time(18, 0)),
        "Dinner": (time(19, 30), time(21, 30))
    }
    current_time = now.time()
    for meal, (start, end) in meals.items():
        if start <= current_time <= end:
            return meal
    return "Off"

def allowed_match(person_id, now: datetime, db):
    threshold = timedelta(minutes=5)
    recent_entry = db.query(MessEntry).filter(MessEntry.person_id == person_id,
                                                MessEntry.entry_time >= now - threshold).first()
    return recent_entry is None