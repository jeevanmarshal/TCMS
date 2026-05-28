from datetime import datetime, timedelta
from typing import Any, Union
from jose import jwt
import bcrypt
from app.core.config import settings

# Checks if the plain password matches the stored hash.
# - bcrypt.checkpw expects both inputs to be bytes.
def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return bcrypt.checkpw(
            plain_password.encode("utf-8"),
            hashed_password.encode("utf-8")
        )
    except Exception:
        return False

# Generates a secure, one-way cryptographic hash of a password using raw bcrypt.
# - Returns a decoded utf-8 string suitable for database storage.
def get_password_hash(password: str) -> str:
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode("utf-8"), salt)
    return hashed.decode("utf-8")

# Generates a signed JWT Access Token containing a subject payload (e.g. user ID)
# - expires_delta: Custom lifespan of the token (falls back to default 30 minutes in settings).
def create_access_token(subject: Union[str, Any], expires_delta: timedelta = None) -> str:
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    # Define payload: 'sub' stands for 'Subject' (standard JWT claim representing the user identity)
    to_encode = {"exp": expire, "sub": str(subject)}
    
    # Encode and sign token with the secret key and algorithm
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt
