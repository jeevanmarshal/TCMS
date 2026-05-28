from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import settings
import pymysql

# Auto-create Database helper to avoid 'Unknown database' crashes for beginners.
try:
    # Separate base connection url and target database name
    base_url, db_name = settings.DATABASE_URL.rsplit('/', 1)
    
    # Parse credentials and host details to establish a raw server connection
    # URL Format: mysql+pymysql://<user>:<password>@<host>:<port>/<dbname>
    url_without_prefix = base_url.replace("mysql+pymysql://", "")
    credentials_part, host_part = url_without_prefix.split("@")
    
    user_pass = credentials_part.split(":")
    user = user_pass[0]
    password = user_pass[1] if len(user_pass) > 1 else ""
    
    host_port = host_part.split(":")
    host = host_port[0]
    port = int(host_port[1]) if len(host_port) > 1 else 3306
    
    # Connect directly to MySQL server and execute CREATE DATABASE if it doesn't exist
    conn = pymysql.connect(host=host, user=user, password=password, port=port)
    cursor = conn.cursor()
    cursor.execute(f"CREATE DATABASE IF NOT EXISTS {db_name}")
    conn.commit()
    conn.close()
    print(f"[*] Database '{db_name}' verified/created successfully.")
except Exception as e:
    # We catch the exception and print a friendly instruction so the app doesn't crash on boot
    print(f"[!] Warning: Could not auto-create database from DATABASE_URL. Error: {e}")
    print("[*] Please ensure you create your database manually using: CREATE DATABASE tcms_db;")
    print("[*] And double check your MySQL credentials inside the 'backend/.env' file.")

# Create the SQLAlchemy database engine.
# - settings.DATABASE_URL connects to our MySQL database.
# - pool_pre_ping=True acts as an automated health check, re-establishing dead connections.
engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True
)

# Configure a session factory.
# - autocommit=False: Ensures changes are committed explicitly (maintaining transaction boundaries).
# - autoflush=False: Prevents unsaved changes from automatically writing to the database before querying.
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class that our SQLAlchemy models will inherit from to be mapped to DB tables.
Base = declarative_base()

# FastAPI Dependency injection function.
# - Creates a new SQLAlchemy session for a single client request.
# - Yields the session to the router.
# - Closes the connection in the `finally` block once the request is complete (prevents leaks).
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
