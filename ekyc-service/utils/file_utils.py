"""
Utility functions for file handling.
"""
import os
import shutil
import uuid
from fastapi import UploadFile
from core.constants import TEMP_DIR
from core.exception import ValidationException
from core.logger import logger

async def save_upload_file_temp(upload_file: UploadFile) -> str:
    """
    Lưu UploadFile vào thư mục temp và trả về đường dẫn.
    Nếu upload_file là None, raise lỗi.
    """
    if not upload_file:
        raise ValidationException("File is required")
    
    file_ext = os.path.splitext(upload_file.filename)[1] if upload_file.filename else ".jpg"
    temp_filename = f"{uuid.uuid4().hex}{file_ext}"
    temp_path = os.path.join(TEMP_DIR, temp_filename)
    
    try:
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(upload_file.file, buffer)
        logger.debug(f"Saved temp file to {temp_path}")
        return temp_path
    except Exception as e:
        logger.error(f"Failed to save temp file: {str(e)}")
        raise ValidationException("Could not process uploaded file")

def remove_temp_file(file_path: str) -> None:
    """
    Xóa file tạm một cách an toàn.
    """
    if file_path and os.path.exists(file_path):
        try:
            os.remove(file_path)
            logger.debug(f"Removed temp file {file_path}")
        except Exception as e:
            logger.warning(f"Could not remove temp file {file_path}: {str(e)}")
