import uvicorn
from fastapi import FastAPI
from database import engine
from models import Base
from routes import router
from utils import load_faces_from_directory
from database import SessionLocal
from models import Person
import logging

Base.metadata.create_all(bind=engine)
app = FastAPI()
app.include_router(router)

@app.on_event("startup")
def startup_event():
    load_faces_from_directory("faces")
    db = SessionLocal()
    kp = db.query(Person.id, Person.name, Person.category).all()
    db.close()
    logging.info(f"Loaded metadata for {len(kp)} people.")

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=False)
