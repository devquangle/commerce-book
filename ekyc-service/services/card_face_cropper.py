"""
Service to crop the portrait face from the front CCCD image.
"""
import cv2
import numpy as np
from typing import Optional
from core.logger import logger

class CardFaceCropper:
    @staticmethod
    def crop_face(card_img: np.ndarray) -> Optional[np.ndarray]:
        """
        Crop vùng ảnh chân dung từ CCCD mặt trước.
        Sử dụng Haar Cascade hoặc có thể dùng layout heuristic (vì CCCD có layout cố định).
        Ở đây dùng OpenCV Haar Cascade Face Detector.
        """
        try:
            logger.info("Starting card face crop...")
            gray = cv2.cvtColor(card_img, cv2.COLOR_BGR2GRAY)
            # Load cascade classifier
            # Lưu ý: Cần file haarcascade_frontalface_default.xml, OpenCV có sẵn trong site-packages
            face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
            
            # Detect faces
            faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))
            
            if len(faces) == 0:
                logger.warning("No face detected on the card image.")
                return None
                
            # Thông thường trên thẻ, ảnh chân dung nằm bên trái. Chọn face lớn nhất.
            faces = sorted(faces, key=lambda x: x[2]*x[3], reverse=True)
            (x, y, w, h) = faces[0]
            
            # Padding một chút để lấy trọn vẹn khuôn mặt
            pad_w = int(w * 0.2)
            pad_h = int(h * 0.2)
            
            x1 = max(0, x - pad_w)
            y1 = max(0, y - pad_h)
            x2 = min(card_img.shape[1], x + w + pad_w)
            y2 = min(card_img.shape[0], y + h + pad_h)
            
            cropped = card_img[y1:y2, x1:x2]
            logger.info(f"Card face cropped successfully. Size: {cropped.shape}")
            return cropped
        except Exception as e:
            logger.error(f"Error cropping face from card: {str(e)}")
            return None
