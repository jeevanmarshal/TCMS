from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field

class Settings(BaseSettings):
    # App configurations with default values
    APP_NAME: str = "Tuition Centre Management System API"
    DEBUG: bool = True
    API_V1_STR: str = "/api/v1"
    
    # Database configuration (must be present in .env)
    DATABASE_URL: str
    
    # JWT security configurations (must be present in .env)
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Tells Pydantic to read from the .env file in the backend root directory
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

# Instantiate the settings object to be imported across the project
settings = Settings()
