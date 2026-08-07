"""
QR Code Service (Reader & Parser).
"""
import cv2
import numpy as np
from typing import Tuple, Optional
from core.logger import logger
from models.response import OcrData
from services.preprocess_service import PreprocessService
from core.constants import REQUIRED_QR_PARTS_MIN

class QrService:
    @staticmethod
    def read_qr(img: np.ndarray) -> Tuple[bool, Optional[str]]:
        """
        Đọc QR bằng OpenCV, fallback sang pyzbar, fallback sang ảnh enhanced.
        Không throw exception, chỉ trả về (detected: bool, data: str).
        """
        try:
            # 1. Thử bằng OpenCV QRCodeDetector
            detector = cv2.QRCodeDetector()
            data, _, _ = detector.detectAndDecode(img)
            if data:
                logger.info("QR read successfully using OpenCV")
                return True, data

            # 2. Thử bằng pyzbar
            from pyzbar.pyzbar import decode
            decoded_objs = decode(img)
            if decoded_objs:
                data = decoded_objs[0].data.decode("utf-8")
                logger.info("QR read successfully using pyzbar")
                return True, data

            # 3. Thử enhance ảnh rồi đọc lại bằng pyzbar
            enhanced = PreprocessService.enhance_for_qr(img)
            decoded_objs = decode(enhanced)
            if decoded_objs:
                data = decoded_objs[0].data.decode("utf-8")
                logger.info("QR read successfully using pyzbar after enhancement")
                return True, data

            logger.info("No QR code detected.")
            return False, None
        except Exception as e:
            logger.error(f"Error reading QR code: {str(e)}")
            return False, None

    @staticmethod
    def parse_qr_data(qr_text: str) -> Optional[OcrData]:
        """
        Parse chuỗi QR của CCCD Việt Nam.
        Format chuẩn: Số CCCD | Số CMND cũ | Họ tên | Ngày sinh | Giới tính | Địa chỉ | Ngày cấp
        """
        if not qr_text:
            return None
            
        parts = [p.strip() for p in qr_text.split('|')]
        if len(parts) < REQUIRED_QR_PARTS_MIN:
            logger.warning("QR data format is invalid (not enough parts).")
            return None
            
        try:
            # Chuyển đổi ngày tháng trong QR (thường là ddmmyyyy) sang dd/mm/yyyy
            def fmt_date(d: str) -> Optional[str]:
                if len(d) == 8 and d.isdigit():
                    return f"{d[0:2]}/{d[2:4]}/{d[4:8]}"
                return None

            data = OcrData(
                identityNumber=parts[0] if len(parts) > 0 and parts[0] else None,
                fullName=parts[2] if len(parts) > 2 and parts[2] else None,
                dateOfBirth=fmt_date(parts[3]) if len(parts) > 3 and parts[3] else None,
                gender=parts[4] if len(parts) > 4 and parts[4] else None,
                placeOfResidence=parts[5] if len(parts) > 5 and parts[5] else None,
                issueDate=fmt_date(parts[6]) if len(parts) > 6 and parts[6] else None,
                # QR của CCCD không chứa nationality, placeOfOrigin, expiryDate
                nationality=None,
                placeOfOrigin=None,
                expiryDate=None
            )
            return data
        except Exception as e:
            logger.error(f"Error parsing QR data: {str(e)}")
            return None
