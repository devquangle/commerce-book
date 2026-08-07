"""
OCR Service using PaddleOCR (Singleton).
"""
import numpy as np
from core.config import settings
from core.logger import logger
from core.exception import OcrException

class OcrService:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            logger.info("Initializing PaddleOCR model (Singleton)...")
            from paddleocr import PaddleOCR
            cls._instance = super(OcrService, cls).__new__(cls)
            cls._instance.ocr = PaddleOCR(
                use_angle_cls=True,
                lang=settings.OCR_LANGUAGE,
                use_gpu=settings.OCR_USE_GPU,
                show_log=False
            )
        return cls._instance

    def extract_text(self, img: np.ndarray) -> list[str]:
        """
        Trích xuất văn bản từ ảnh.
        Trả về danh sách các dòng text đã được nhận diện.
        """
        try:
            result = self.ocr.ocr(img, cls=True)
            if not result or not result[0]:
                return []
            
            lines = []
            for line in result[0]:
                # line[1][0] là text, line[1][1] là confidence
                text = line[1][0]
                lines.append(text)
            
            return lines
        except Exception as e:
            logger.error(f"OCR Exception: {str(e)}")
            raise OcrException("Failed to extract text from image")
            
    def extract_raw(self, img: np.ndarray):
        """
        Trả về raw result bao gồm bbox, text, confidence để debug.
        """
        try:
            return self.ocr.ocr(img, cls=True)
        except Exception as e:
            logger.error(f"OCR Raw Exception: {str(e)}")
            return None

# Export instance duy nhất
ocr_service = OcrService()
