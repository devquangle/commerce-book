"""
Core constants for the eKYC Service.
"""
import os
from core.config import settings

# Base directory
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Directories
TEMP_DIR = os.path.join(BASE_DIR, "temp")
LOGS_DIR = os.path.join(BASE_DIR, "logs")
CACHE_DIR = os.path.join(BASE_DIR, "cache")
WEIGHTS_DIR = os.path.join(BASE_DIR, "weights")

# Ensure required directories exist
for directory in [TEMP_DIR, LOGS_DIR, CACHE_DIR, WEIGHTS_DIR]:
    os.makedirs(directory, exist_ok=True)

# Image Validation
ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/jpg"}

# QR Data configuration
REQUIRED_QR_PARTS_MIN = 6
