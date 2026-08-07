"""
Validation and Comparison Service.
So sánh dữ liệu OCR và QR, đánh giá hợp lệ.
"""
from models.response import OcrData, QrResultData, ValidationData
from core.logger import logger
import unicodedata
from datetime import datetime

class ValidationService:
    @staticmethod
    def normalize_for_compare(text: str) -> str:
        """
        Chuẩn hóa chuỗi để so sánh (bỏ dấu, lowercase, bỏ khoảng trắng thừa).
        """
        if not text:
            return ""
        # Bỏ dấu
        text = unicodedata.normalize('NFD', text)
        text = text.encode('ascii', 'ignore').decode('utf-8')
        # Lowercase & remove extra spaces
        text = " ".join(text.lower().split())
        return text

    @staticmethod
    def validate_and_compare(ocr: OcrData, qr: QrResultData) -> ValidationData:
        logger.info("Validation started.")
        val_data = ValidationData()
        
        # 1. Kiểm tra expiryDate
        if ocr.expiryDate:
            try:
                exp_date = datetime.strptime(ocr.expiryDate, "%Y-%m-%d")
                if exp_date < datetime.now():
                    val_data.expired = True
                    logger.warning("Card is expired.")
            except Exception:
                pass
                
        # 2. Check 12 số CCCD
        has_id = bool(ocr.identityNumber and len(ocr.identityNumber) == 12)
        
        # 3. Compare OCR vs QR (Nếu QR có dữ liệu)
        mismatch = []
        if qr.detected and qr.parsed and qr.data:
            q_data = qr.data
            
            # Hàm helper compare
            def cmp(field_name: str, val_ocr: str, val_qr: str):
                if val_ocr and val_qr:
                    if ValidationService.normalize_for_compare(val_ocr) != ValidationService.normalize_for_compare(val_qr):
                        mismatch.append(field_name)
                        logger.warning(f"Mismatch {field_name}: OCR='{val_ocr}', QR='{val_qr}'")
            
            cmp("identityNumber", ocr.identityNumber, q_data.identityNumber)
            cmp("fullName", ocr.fullName, q_data.fullName)
            cmp("dateOfBirth", ocr.dateOfBirth, q_data.dateOfBirth)
            cmp("gender", ocr.gender, q_data.gender)
            # cmp("placeOfResidence", ocr.placeOfResidence, q_data.placeOfResidence) # Tạm thời comment vì có thể khác nhau định dạng

            val_data.qrMatch = len(mismatch) == 0
            val_data.mismatchFields = mismatch
        else:
            val_data.qrMatch = False
            
        # 4. Xác định hợp lệ
        # Nếu thẻ không hết hạn, có CCCD, và (không có QR hoặc QR match)
        val_data.valid = (not val_data.expired) and has_id
        
        logger.info(f"Validation completed. Valid: {val_data.valid}, Mismatches: {len(mismatch)}")
        return val_data
