from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import create_access_token, verify_password
from app.crud.crud_user import get_user_by_email
from app.schemas.auth import Token, UserResponse
from app.api.deps import get_current_user
from app.models.user import User

router = APIRouter()

# 1. Login Endpoint: authenticates and generates JWT token
# - OAuth2PasswordRequestForm: parses incoming credentials. 
#   Note: form_data.username captures the Email address, form_data.password captures the password.
@router.post("/login", response_model=Token)
def login(
    db: Session = Depends(get_db),
    form_data: OAuth2PasswordRequestForm = Depends()
):
    # Fetch user from DB by email
    user = get_user_by_email(db, email=form_data.username)
    
    # Verify user exists and check password hash matches
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect email or password"
        )
        
    # Check if account is active
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This account is currently deactivated"
        )
        
    # Generate the access token using the user's primary key (ID) as the subject
    access_token = create_access_token(subject=user.id)
    
    return {
        "access_token": access_token, 
        "token_type": "bearer"
    }

# 2. Logout Endpoint
# - Requires active authentication.
# - As JWTs are stateless, actual deletion is done by React clearing localStorage.
# - We provide this endpoint to support logging, token blacklisting, or audits if needed.
@router.post("/logout")
def logout(current_user: User = Depends(get_current_user)):
    return {"message": "Successfully logged out. Please clear your local storage token."}

# 3. Current User Endpoint: returns profile info of the logged-in administrator
# - response_model=UserResponse: shapes the output (hides hashed_password field).
@router.get("/me", response_model=UserResponse)
def read_current_user_profile(current_user: User = Depends(get_current_user)):
    return current_user
