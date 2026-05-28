from sqlalchemy import Column, Integer, String, Text, Date
from app.core.database import Base

class Student(Base):
    __tablename__ = "students"

    # Primary key that auto-increments
    id = Column(Integer, primary_key=True, index=True)
    
    # Student's name (required)
    name = Column(String(100), nullable=False)
    
    # Unique email address (indexed for rapid search)
    email = Column(String(100), unique=True, index=True, nullable=False)
    
    # Phone number (required)
    phone = Column(String(20), nullable=False)
    
    # Address (nullable, stored as larger text block)
    address = Column(Text, nullable=True)
    
    # Gender (Male, Female, etc.)
    gender = Column(String(20), nullable=False)
    
    # Date of Birth (Date type maps directly to SQL date)
    date_of_birth = Column(Date, nullable=True)
