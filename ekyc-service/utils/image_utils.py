"""
utils/image_utils.py

Các hàm tiện ích xử lý ảnh dùng chung trong toàn bộ service.
Bao gồm: load ảnh từ bytes, lưu tạm file, chuẩn hóa ảnh.
"""

import logging
import os
import uuid
from pathlib import Path
from typing import Optional

import cv2
import numpy as np

logger = logging.getLogger(__name__)

# Thư mục lưu file tạm
TEMP_DIR = Path("temp")
UPLOAD_DIR = Path("uploads")


def ensure_directories() -> None:
    """Tạo các thư mục cần thiết nếu chưa tồn tại."""
    TEMP_DIR.mkdir(parents=True, exist_ok=True)
    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    logger.info("[OK] Directories temp/ and uploads/ checked.")


def load_image_from_bytes(data: bytes) -> Optional[np.ndarray]:
    try:
        nparr = np.frombuffer(data, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        if img is None:
            logger.warning("[WARN] Cannot decode image from bytes.")
            return None
        logger.debug(f"Loaded image from bytes, shape: {img.shape}")
        return img
    except Exception as e:
        logger.error(f"[ERROR] Error loading image from bytes: {e}")
        return None


def save_temp_image(data: bytes, prefix: str = "img") -> str:
    """
    Lưu ảnh tạm vào thư mục temp với tên file ngẫu nhiên (UUID).

    Args:
        data: Raw bytes của file ảnh.
        prefix: Tiền tố tên file (vd: 'idcard', 'selfie').

    Returns:
        Đường dẫn tuyệt đối tới file đã lưu.

    Raises:
        IOError: Nếu không thể lưu file.
    """
    ensure_directories()
    unique_name = f"{prefix}_{uuid.uuid4().hex}.jpg"
    file_path = TEMP_DIR / unique_name

    try:
        with open(file_path, "wb") as f:
            f.write(data)
        logger.debug(f"Đã lưu file tạm: {file_path}")
        return str(file_path)
    except IOError as e:
        logger.error(f"Không thể lưu file tạm {file_path}: {e}")
        raise


def delete_temp_file(file_path: str) -> None:
    """
    Xóa file tạm sau khi xử lý xong.

    Args:
        file_path: Đường dẫn tới file cần xóa.
    """
    try:
        if os.path.exists(file_path):
            os.remove(file_path)
            logger.debug(f"Đã xóa file tạm: {file_path}")
    except OSError as e:
        logger.warning(f"Không thể xóa file tạm {file_path}: {e}")


def normalize_image(img: np.ndarray) -> np.ndarray:
    """
    Chuẩn hóa ảnh trước khi xử lý OCR:
    - Resize nếu quá nhỏ
    - Tăng contrast nhẹ
    - Đảm bảo ảnh là 3-channel BGR

    Args:
        img: numpy array (BGR).

    Returns:
        numpy array đã được chuẩn hóa.
    """
    # Đảm bảo ảnh là 3-channel
    if len(img.shape) == 2:
        img = cv2.cvtColor(img, cv2.COLOR_GRAY2BGR)
    elif img.shape[2] == 4:
        img = cv2.cvtColor(img, cv2.COLOR_BGRA2BGR)

    # Resize nếu ảnh quá nhỏ (min 800px width để OCR hoạt động tốt)
    h, w = img.shape[:2]
    if w < 800:
        scale = 800 / w
        new_w = 800
        new_h = int(h * scale)
        img = cv2.resize(img, (new_w, new_h), interpolation=cv2.INTER_LANCZOS4)
        logger.debug(f"Đã resize ảnh từ {w}x{h} lên {new_w}x{new_h}")

    return img


def crop_face_region(
    img: np.ndarray,
    bbox: list[int],
    padding: float = 0.2
) -> np.ndarray:
    """
    Crop vùng khuôn mặt từ ảnh với padding.

    Args:
        img: Ảnh gốc (BGR).
        bbox: Bounding box [x1, y1, x2, y2].
        padding: Tỷ lệ padding thêm xung quanh face (0.2 = 20%).

    Returns:
        Ảnh đã crop chứa khuôn mặt.
    """
    h, w = img.shape[:2]
    x1, y1, x2, y2 = [int(v) for v in bbox]

    face_w = x2 - x1
    face_h = y2 - y1

    pad_x = int(face_w * padding)
    pad_y = int(face_h * padding)

    x1 = max(0, x1 - pad_x)
    y1 = max(0, y1 - pad_y)
    x2 = min(w, x2 + pad_x)
    y2 = min(h, y2 + pad_y)

    cropped = img[y1:y2, x1:x2]
    logger.debug(f"Đã crop face region: [{x1},{y1},{x2},{y2}]")
    return cropped
