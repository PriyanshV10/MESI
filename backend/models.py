from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from database import Base

class Person(Base):
    __tablename__ = "people"
    id = Column(Integer, primary_key=True, index=True)
    college_id = Column(String, unique=True, nullable=True)
    name = Column(String, index=True)
    category = Column(String, index=True)
    face_encoding = Column(String)

class MessEntry(Base):
    __tablename__ = "mess_entries"
    id = Column(Integer, primary_key=True, index=True)
    person_id = Column(Integer)
    entry_time = Column(DateTime, default=datetime.utcnow)
    meal_type = Column(String)
    source = Column(String)