from sqlalchemy import Column, Integer, String, Boolean
from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    # Primary key that auto-increments
    id = Column(Integer, primary_key=True, index=True)
    
    # Unique email used as the login identifier
    email = Column(String(100), unique=True, index=True, nullable=False)
    
    # Securely stored password hash (never plain text!)
    hashed_password = Column(String(255), nullable=False)
    
    # Basic profile information
    full_name = Column(String(100), nullable=True)
    
    # Scalable role field to easily support Admin vs Teacher permissions later
    role = Column(String(50), default="admin", nullable=False)
    
    # Quick flag to disable accounts without deleting them
    is_active = Column(Boolean, default=True, nullable=False)
