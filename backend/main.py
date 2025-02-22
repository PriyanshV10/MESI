import uvicorn
from fastapi import FastAPI
from database import engine
from models import Base
from routes import router, known_people
from utils import load_faces_from_directory
from database import SessionLocal
from models import Person

Base.metadata.create_all(bind=engine)
app = FastAPI()
app.include_router(router)

@app.on_event("startup")
def startup_event():
    # Load face encodings into the database from the enrollment folder.
    load_faces_from_directory("faces")
    db = SessionLocal()
    kp = db.query(Person).all()
    known_people.clear()
    known_people.extend(kp)
    db.close()

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=False)
