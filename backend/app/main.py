from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings

# Important: We import Base and engine to manage database tables
from app.core.database import Base, engine, SessionLocal

# Important: We MUST import the database models so SQLAlchemy is aware of them
# and can generate them inside the MySQL database automatically.
from app.models.user import User
from app.models.student import Student

from app.api.v1 import auth, students
from app.crud.crud_user import create_admin_user_if_not_exists

# 1. Initialize Database Tables
# In beginner projects, this auto-generates tables in MySQL on application boot.
# (For advanced/production apps, database migrations are handled using Alembic).
Base.metadata.create_all(bind=engine)

# 2. Instantiate the FastAPI application
app = FastAPI(
    title=settings.APP_NAME,
    description="Backend service for the Tuition Centre / Student Management System (TCMS).",
    version="1.0.0",
    docs_url="/docs",      # Interactive Swagger documentation path
    redoc_url="/redoc"     # Alternative documentation layout
)

# 3. Configure CORS Middleware
# Prevents web browsers from blocking API requests sent from our React application (port 3000)
# to our backend server (port 8000).
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React app development port
    allow_credentials=True,
    allow_methods=["*"],                      # Permits GET, POST, PUT, DELETE, etc.
    allow_headers=["*"],                      # Permits all header keys (like Authorization)
)

# 4. Integrate Endpoint Routers
# Maps `/api/v1/auth` and `/api/v1/students` endpoints to their respective logic scripts
app.include_router(
    auth.router, 
    prefix=f"{settings.API_V1_STR}/auth", 
    tags=["Authentication"]
)
app.include_router(
    students.router, 
    prefix=f"{settings.API_V1_STR}/students", 
    tags=["Students"]
)

# 5. Startup Hook: Auto-seeds the default Administrator User
# Runs automatically the moment the backend web server starts up.
@app.on_event("startup")
def on_startup():
    db = SessionLocal()
    try:
        admin_user = create_admin_user_if_not_exists(db)
        print(f"[*] Default Administrator seed verified: {admin_user.email}")
    except Exception as e:
        print(f"[!] Error seeding admin user: {e}")
    finally:
        db.close()

# Basic health check endpoint
@app.get("/")
def health_check():
    return {
        "status": "healthy",
        "app": settings.APP_NAME
    }
