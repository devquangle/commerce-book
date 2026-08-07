"""
Utility functions for image processing using OpenCV in RAM.
"""
import cv2
import numpy as np
from typing import Optional
from fastapi import UploadFile

async def read_image_from_upload(upload_file: UploadFile) -> Optional[np.ndarray]:
    """
    Đọc UploadFile thành numpy array (OpenCV image) trên RAM.
    """
    if not upload_file:
        return None
    try:
        contents = await upload_file.read()
        nparr = np.frombuffer(contents, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        return img
    except Exception:
        return None

def base64_to_image(b64_string: str) -> Optional[np.ndarray]:
    """
    Chuyển đổi base64 string thành numpy array.
    """
    import base64
    try:
        if "," in b64_string:
            b64_string = b64_string.split(",")[1]
        img_data = base64.b64decode(b64_string)
        nparr = np.frombuffer(img_data, np.uint8)
        return cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    except Exception:
        return None

def image_to_base64(img: np.ndarray) -> Optional[str]:
    """
    Chuyển đổi numpy array thành base64 string.
    """
    import base64
    try:
        _, buffer = cv2.imencode('.jpg', img)
        return base64.b64encode(buffer).decode('utf-8')
    except Exception:
        return None
