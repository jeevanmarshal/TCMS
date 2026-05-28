from sqlalchemy.orm import Session
from app.models.user import User
from app.core.security import get_password_hash

# Retrieves a user from the database by their unique email
def get_user_by_email(db: Session, email: str) -> User:
    return db.query(User).filter(User.email == email).first()

# Retrieves a user from the database by their primary key (ID)
def get_user_by_id(db: Session, user_id: int) -> User:
    return db.query(User).filter(User.id == user_id).first()

# Seeds a default administrator user so the student management system is instantly testable.
# - Credentials: Email = admin@tcms.com, Password = admin123
def create_admin_user_if_not_exists(db: Session) -> User:
    admin_email = "admin@tcms.com"
    existing_user = get_user_by_email(db, admin_email)
    
    if not existing_user:
        hashed_password = get_password_hash("admin123")
        new_admin = User(
            email=admin_email,
            hashed_password=hashed_password,
            full_name="Administrator",
            role="admin",
            is_active=True
        )
        db.add(new_admin)
        db.commit()
        db.refresh(new_admin)
        return new_admin
        
    return existing_user
