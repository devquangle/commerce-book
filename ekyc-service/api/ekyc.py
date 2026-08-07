"""
API Router for eKYC.
Chỉ nhận request, validate cơ bản và gọi EkycService.
"""
from fastapi import APIRouter, File, UploadFile
from services.ekyc_service import EkycService
from utils.response import success_response
from core.exception import ValidationException
from core.config import settings

router = APIRouter()

@router.post("/card")
async def verify_card(
    frontImage: UploadFile = File(...),
    backImage: UploadFile = File(...)
):
    """
    API 1: Đọc & Xác thực thông tin CCCD.
    - Đọc OCR.
    - Đọc QR.
    - So sánh và Validate.
    """
    # Validate file presence
    if not frontImage or not frontImage.filename:
        raise ValidationException("frontImage is missing or empty")
    if not backImage or not backImage.filename:
        raise ValidationException("backImage is missing or empty")
        
    # Validate file size (FastAPI does not have built-in size limit in File(...), 
    # we can check by reading or use a dependency. For simplicity, we assume upload succeeds 
    # but could be limited by server proxy).
    
    # Process Card
    result, _ = await EkycService.process_card(frontImage, backImage)
    
    return success_response(
        data=result.model_dump(by_alias=True, exclude_none=False),
        message="Card parsed successfully"
    )

@router.post("/verify")
async def verify_identity(
    frontImage: UploadFile = File(...),
    backImage: UploadFile = File(...),
    selfieImage: UploadFile = File(...)
):
    """
    API 2: Face Verification & Liveness.
    - Thực hiện quy trình API 1
    - Cắt ảnh CCCD
    - Kiểm tra Liveness ảnh Selfie
    - So sánh khuôn mặt
    """
    if not frontImage or not backImage or not selfieImage:
        raise ValidationException("Missing required images")
        
    result = await EkycService.process_verify(frontImage, backImage, selfieImage)
    
    return success_response(
        data=result.model_dump(by_alias=True, exclude_none=False),
        message="Identity verified successfully"
    )
