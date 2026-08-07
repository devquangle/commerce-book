import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    """
    Core settings for the eKYC Service.
    Reads from environment variables and .env file.
    """
    APP_NAME: str = "eKYC Service"
    APP_VERSION: str = "1.0.0"
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    DEBUG: bool = False
    LOG_LEVEL: str = "INFO"
    FACE_THRESHOLD: float = 0.5
    
    PLACE_LIVE_API_KEY: str = ""
    PLACE_LIVE_SECRET: str = ""
    
    OCR_LANGUAGE: str = "vi"
    OCR_USE_GPU: bool = False
    
    MAX_UPLOAD_SIZE: int = 5242880  # 5MB in bytes

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

# Khởi tạo instance config duy nhất để sử dụng toàn cục
settings = Settings()
