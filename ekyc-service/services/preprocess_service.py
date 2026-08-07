"""
Image preprocessing service for CCCD OCR enhancement.
"""
import cv2
import numpy as np
from core.logger import logger

class PreprocessService:
    @staticmethod
    def enhance_for_ocr(img: np.ndarray) -> np.ndarray:
        """
        Thực hiện chuỗi xử lý ảnh để tăng cường chất lượng cho OCR.
        Pipeline: Resize -> CLAHE -> Denoise -> Sharpen
        """
        try:
            # 1. Resize if too small or too large
            h, w = img.shape[:2]
            target_w = 1200
            if w != target_w:
                ratio = target_w / float(w)
                img = cv2.resize(img, (target_w, int(h * ratio)), interpolation=cv2.INTER_CUBIC)
                
            # 2. Convert to Grayscale
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            
            # 3. Apply CLAHE (Contrast Limited Adaptive Histogram Equalization)
            clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
            enhanced = clahe.apply(gray)
            
            # 4. Denoise
            denoised = cv2.fastNlMeansDenoising(enhanced, None, 10, 7, 21)
            
            # 5. Sharpening
            kernel = np.array([[-1,-1,-1], [-1,9,-1], [-1,-1,-1]])
            sharpened = cv2.filter2D(denoised, -1, kernel)
            
            # Convert back to BGR for PaddleOCR
            result = cv2.cvtColor(sharpened, cv2.COLOR_GRAY2BGR)
            return result
        except Exception as e:
            logger.warning(f"Image enhancement failed, returning original: {str(e)}")
            return img

    @staticmethod
    def enhance_for_qr(img: np.ndarray) -> np.ndarray:
        """
        Tăng cường ảnh đặc biệt cho QR Code reader.
        """
        try:
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            # Adaptive Threshold cho QR
            thresh = cv2.adaptiveThreshold(
                gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2
            )
            return thresh
        except Exception as e:
            logger.warning(f"QR image enhancement failed: {str(e)}")
            return img
