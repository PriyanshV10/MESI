import os
import json
from datetime import datetime, time, timedelta
import numpy as np
import cv2
from deepface import DeepFace
from models import Person, MessEntry
from database import SessionLocal
from config import DATABASE_PATH, DETECTOR_BACKEND_DB, RECOGNITION_MODEL_DB, DUPLICATE_ENTRY_THRESHOLD_MINUTES
import logging

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

def json_encode_encoding(encoding):
    return json.dumps(encoding.tolist() if isinstance(encoding, np.ndarray) else encoding)

def json_decode_encoding(encoding_str):
    return np.array(json.loads(encoding_str))

def cosine_distance(vec1, vec2):
    dot = np.dot(vec1, vec2)
    norm1 = np.linalg.norm(vec1)
    norm2 = np.linalg.norm(vec2)
    if norm1 == 0 or norm2 == 0:
        return 1.0
    return 1 - (dot / (norm1 * norm2))

def load_faces_from_directory(base_dir=DATABASE_PATH):
    db = SessionLocal()
    try:
        for category in ["students", "staff"]:
            folder_path = os.path.join(base_dir, category)
            if os.path.exists(folder_path):
                for file in os.listdir(folder_path):
                    if file.lower().endswith((".jpg", ".jpeg", ".png")):
                        full_path = os.path.join(folder_path, file)
                        try:
                            representation = DeepFace.represent(
                                img_path=full_path,
                                model_name=RECOGNITION_MODEL_DB,
                                detector_backend=DETECTOR_BACKEND_DB,
                                enforce_detection=False,
                                align=True
                            )
                            if not representation:
                                continue
                            encoding = np.array(representation[0]["embedding"])
                        except Exception as e:
                            logging.error(f"Error processing {full_path}: {e}")
                            continue
                        if category == "students":
                            if "-" not in file:
                                continue
                            college_id, name_ext = file.split("-", 1)
                            name = os.path.splitext(name_ext)[0]
                        else:
                            college_id = None
                            name = os.path.splitext(file)[0]
                        existing = db.query(Person).filter(Person.name == name).first()
                        if existing:
                            logging.info(f"Skipping duplicate entry for {name}")
                            continue
                        person = Person(
                            college_id=college_id,
                            name=name,
                            category=category,
                            face_encoding=json_encode_encoding(encoding)
                        )
                        db.add(person)
                db.commit()
                logging.info(f"Loaded faces from {folder_path}")
    except Exception as e:
        logging.error(f"An error occurred: {e}")
        db.rollback()
    finally:
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