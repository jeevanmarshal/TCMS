from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlalchemy.orm import Session
from app.core.config import settings
from app.core.database import get_db
from app.crud.crud_user import get_user_by_id
from app.models.user import User

# This helper class parses the HTTP header for a Bearer token automatically.
# - tokenUrl: Tells Swagger UI / Docs where users go to get their token.
oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_STR}/auth/login"
)

# Interceptor dependency to decode and validate JWT tokens, returning the current user object
# - Requires a DB session to find the matching user.
# - Requires a token parsed from the request headers using oauth2_scheme.
def get_current_user(
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme)
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate authentication credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        # 1. Decode the token using our global Secret Key and signing algorithm
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        
        # 2. Extract the user ID (stored in 'sub' claim)
        user_id_str: str = payload.get("sub")
        if user_id_str is None:
            raise credentials_exception
        user_id = int(user_id_str)
        
    except (JWTError, ValueError):
        # Triggered if token is expired, tampered with, or invalid format
        raise credentials_exception
        
    # 3. Look up the user in our database
    user = get_user_by_id(db, user_id=user_id)
    if user is None:
        raise credentials_exception
        
    # 4. Check if the account has been deactivated
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This user account has been deactivated"
        )
        
    # Returns the authenticated database User object
    return user
