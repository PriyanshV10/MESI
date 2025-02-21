from pydantic import BaseModel
from datetime import datetime

class BulkData(BaseModel):
    person_id: int
    name: str
    category: str
    entry_time: datetime
    meal_type: str
    source: str

class PersonSchema(BaseModel):
    id: int
    college_id: str | None = None
    name: str
    category: str

    class Config:
        orm_mode = True
