from pydantic import BaseModel
from typing import Optional
from datetime import date

# Shared base schema fields
class StudentBase(BaseModel):
    name: str
    email: str
    phone: str
    address: Optional[str] = None
    gender: str
    date_of_birth: Optional[date] = None

# Schema used when creating a new student (all base fields required)
class StudentCreate(StudentBase):
    pass

# Schema used when updating a student (all fields become optional, allowing partial updates)
class StudentUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    gender: Optional[str] = None
    date_of_birth: Optional[date] = None

# Schema used when returning student details to the React client (includes database ID)
class StudentResponse(StudentBase):
    id: int

    # Configures Pydantic to read SQLAlchemy database row objects
    model_config = {
        "from_attributes": True
    }
