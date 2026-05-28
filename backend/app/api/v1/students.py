from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.api.deps import get_current_user
from app.core.database import get_db
from app.schemas.student import StudentCreate, StudentUpdate, StudentResponse
from app.crud.crud_student import (
    get_student_by_id,
    get_student_by_email,
    get_students,
    create_student,
    update_student,
    delete_student
)
from app.models.user import User

router = APIRouter()

# 1. READ ALL / SEARCH STUDENTS
# - GET /api/v1/students/
# - Takes search parameter to filter records.
# - Takes skip and limit parameters for list pagination.
# - Securely protected by get_current_user.
@router.get("/", response_model=List[StudentResponse])
def read_students_list(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    search: Optional[str] = None,
    current_user: User = Depends(get_current_user)
):
    students = get_students(db, skip=skip, limit=limit, search=search)
    return students

# 2. CREATE STUDENT
# - POST /api/v1/students/
# - Takes StudentCreate payload, performs Pydantic validation.
# - Checks for existing email address to prevent duplicate profiles.
@router.post("/", response_model=StudentResponse, status_code=status.HTTP_201_CREATED)
def add_new_student(
    student_in: StudentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Prevent duplicate students with identical email
    existing_student = get_student_by_email(db, email=student_in.email)
    if existing_student:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A student registration with this email address already exists."
        )
    return create_student(db, student_in=student_in)

# 3. READ SINGLE STUDENT
# - GET /api/v1/students/{student_id}
@router.get("/{student_id}", response_model=StudentResponse)
def read_single_student_details(
    student_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    student = get_student_by_id(db, student_id=student_id)
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Student record with ID {student_id} not found."
        )
    return student

# 4. UPDATE STUDENT
# - PUT /api/v1/students/{student_id}
# - Takes StudentUpdate schema, permitting partial updates.
# - Validates updated emails for conflicts with other profiles.
@router.put("/{student_id}", response_model=StudentResponse)
def edit_student_details(
    student_id: int,
    student_in: StudentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    student = get_student_by_id(db, student_id=student_id)
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Student record with ID {student_id} not found."
        )
        
    # Prevent updating to an email that is already used by another student
    if student_in.email and student_in.email != student.email:
        email_conflict = get_student_by_email(db, email=student_in.email)
        if email_conflict:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="This email address is already registered to another student."
            )
            
    return update_student(db, db_student=student, student_in=student_in)

# 5. DELETE STUDENT
# - DELETE /api/v1/students/{student_id}
@router.delete("/{student_id}", response_model=StudentResponse)
def delete_student_record(
    student_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    student = get_student_by_id(db, student_id=student_id)
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Student record with ID {student_id} not found."
        )
    return delete_student(db, db_student=student)
