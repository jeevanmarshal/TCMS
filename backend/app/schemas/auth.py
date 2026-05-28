from pydantic import BaseModel
from typing import Optional

# Schema to parse incoming login credentials from React form.
class UserLogin(BaseModel):
    email: str
    password: str

# Schema to serialize outgoing JWT token payload.
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

# Schema to validate decoded JWT payload internally.
class TokenData(BaseModel):
    email: Optional[str] = None
    user_id: Optional[int] = None

# Schema to return safe, verified user profile details (excludes hashed password!).
class UserResponse(BaseModel):
    id: int
    email: str
    full_name: Optional[str] = None
    role: str
    is_active: bool

    # tells Pydantic to read ORM objects (like SQLAlchemy db rows) directly.
    # In Pydantic v2, we use model_config to configure this.
    model_config = {
        "from_attributes": True
    }
