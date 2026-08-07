"""
eKYC Orchestrator Service.
Kết nối các module nhỏ lại với nhau.
"""
from fastapi import UploadFile
from typing import Tuple
from core.logger import logger
from models.response import CardResponseData, QrResultData
from utils.image_utils import read_image_from_upload
from services.card_detector import CardDetector
from services.ocr_service import ocr_service
from services.qr_service import QrService
from services.parser_service import ParserService
from services.validation_service import ValidationService
from core.exception import ValidationException

class EkycService:
    @staticmethod
    async def process_card(front_image: UploadFile, back_image: UploadFile) -> CardResponseData:
        logger.info("Request received. Processing card images...")
        
        # 1. Read images
        front_img = await read_image_from_upload(front_image)
        back_img = await read_image_from_upload(back_image)
        
        if front_img is None or back_img is None:
            raise ValidationException("Invalid image format or corrupted file")
            
        logger.info("Image loaded successfully.")
        
        # 2. Detect and Crop
        front_crop = CardDetector.detect_and_crop(front_img)
        back_crop = CardDetector.detect_and_crop(back_img)
        logger.info("Card detected, transform and deskew completed.")
        
        # 3. OCR (Front & Back)
        logger.info("OCR started.")
        front_lines = ocr_service.extract_text(front_crop)
        back_lines = ocr_service.extract_text(back_crop)
        logger.info(f"OCR completed. Front lines: {len(front_lines)}, Back lines: {len(back_lines)}")
        
        # Log raw result
        logger.debug(f"Front OCR text: {front_lines}")
        logger.debug(f"Back OCR text: {back_lines}")
        
        # 4. Parse OCR text using Regex
        ocr_data = ParserService.parse_ocr_lines(front_lines, back_lines)
        logger.info("Regex parsed successfully.")
        
        # 5. Read and Parse QR (From back image)
        qr_result = QrResultData()
        qr_detected, qr_raw = QrService.read_qr(back_crop)
        if qr_detected and qr_raw:
            logger.info("QR detected and decoded.")
            logger.debug(f"QR raw string: {qr_raw}")
            qr_result.detected = True
            parsed_data = QrService.parse_qr_data(qr_raw)
            if parsed_data:
                qr_result.parsed = True
                qr_result.data = parsed_data
                logger.info("QR parsed successfully.")
            else:
                logger.warning("Failed to parse QR data.")
                
        # 6. Validation and Compare
        validation_data = ValidationService.validate_and_compare(ocr_data, qr_result)
        
        # 7. Response generated
        response_data = CardResponseData(
            ocr=ocr_data,
            qr=qr_result,
            validation=validation_data
        )
        logger.info("Card response generated.")
        
        return response_data, front_img

    @staticmethod
    async def process_verify(front_image: UploadFile, back_image: UploadFile, selfie_image: UploadFile):
        from models.response import VerifyResponseData
        from services.card_face_cropper import CardFaceCropper
        from services.face_verify_service import face_verify_service
        from services.liveness_service import liveness_service
        
        logger.info("Verify Request received.")
        
        # 1. Run Card Pipeline
        card_response, front_img = await EkycService.process_card(front_image, back_image)
        
        # 2. Read Selfie Image
        selfie_img = await read_image_from_upload(selfie_image)
        if selfie_img is None:
            raise ValidationException("Invalid selfie image")
            
        # 3. Crop Face from CCCD
        card_face = CardFaceCropper.crop_face(front_img)
        if card_face is None:
            raise ValidationException("Could not detect face on CCCD front image", "FACE_NOT_FOUND")
            
        # 4. Face Verification (Selfie Detection, Alignment, Embedding, Similarity inside service)
        face_data = face_verify_service.verify_faces(card_face, selfie_img)
        
        # 5. Liveness Check
        liveness_data = liveness_service.check_liveness(selfie_img)
        
        # 6. Final Validation
        val = card_response.validation
        val.faceMatch = face_data.matched
        val.livenessPass = liveness_data.isLive
        
        # Evaluate final validity
        val.valid = val.valid and val.faceMatch and val.livenessPass
        
        logger.info(f"Final validation completed. Valid: {val.valid}")
        
        # 7. Generate Response
        return VerifyResponseData(
            ocr=card_response.ocr,
            qr=card_response.qr,
            validation=val,
            face=face_data,
            liveness=liveness_data
        )
