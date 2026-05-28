from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.models.student import Student
from app.schemas.student import StudentCreate, StudentUpdate

# Find a single student by primary key (ID)
def get_student_by_id(db: Session, student_id: int) -> Student:
    return db.query(Student).filter(Student.id == student_id).first()

# Find a single student by email (useful to prevent duplicate email registrations)
def get_student_by_email(db: Session, email: str) -> Student:
    return db.query(Student).filter(Student.email == email).first()

# Retrieve a paginated list of students, optionally filtered by a search query
# - search: standard search string to match against name, email, or phone.
# - skip & limit: pagination parameters for scalable list loading.
def get_students(db: Session, skip: int = 0, limit: int = 100, search: str = None):
    query = db.query(Student)
    
    if search:
        # Case-insensitive partial matching (LIKE) across multiple fields using or_()
        search_filter = f"%{search}%"
        query = query.filter(
            or_(
                Student.name.ilike(search_filter),
                Student.email.ilike(search_filter),
                Student.phone.ilike(search_filter)
            )
        )
        
    return query.offset(skip).limit(limit).all()

# Create and persist a new Student record in the database
def create_student(db: Session, student_in: StudentCreate) -> Student:
    new_student = Student(
        name=student_in.name,
        email=student_in.email,
        phone=student_in.phone,
        address=student_in.address,
        gender=student_in.gender,
        date_of_birth=student_in.date_of_birth
    )
    db.add(new_student)
    db.commit()
    db.refresh(new_student) # Reload model instance with database-generated ID
    return new_student

# Update an existing Student's attributes dynamically
# - db_student: The database object loaded from the database.
# - student_in: The validated data payload received from the request body.
def update_student(db: Session, db_student: Student, student_in: StudentUpdate) -> Student:
    # exclude_unset=True ensures we only overwrite fields explicitly present in the request body
    update_data = student_in.model_dump(exclude_unset=True)
    
    for field, value in update_data.items():
        setattr(db_student, field, value)
        
    db.commit()
    db.refresh(db_student)
    return db_student

# Permanently delete a student record from the database
def delete_student(db: Session, db_student: Student) -> Student:
    db.delete(db_student)
    db.commit()
    return db_student
