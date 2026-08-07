"""
models/ekyc_response.py

Pydantic models cho response eKYC theo chuẩn yêu cầu.
"""

from typing import Optional
from pydantic import BaseModel, Field


class OcrData(BaseModel):
    """Thông tin OCR đã chuẩn hoá từ CCCD."""

    identityNumber: Optional[str] = Field(default=None, description="Số CCCD 12 chữ số")
    fullName: Optional[str] = Field(default=None, description="Họ và tên đầy đủ")
    dateOfBirth: Optional[str] = Field(default=None, description="Ngày sinh (yyyy-MM-dd)")
    gender: Optional[str] = Field(default=None, description="Giới tính (MALE/FEMALE)")
    nationality: Optional[str] = Field(default=None, description="Quốc tịch")
    placeOfOrigin: Optional[str] = Field(default=None, description="Quê quán")
    placeOfResidence: Optional[str] = Field(default=None, description="Nơi thường trú")
    issueDate: Optional[str] = Field(default=None, description="Ngày cấp (yyyy-MM-dd)")
    expiryDate: Optional[str] = Field(default=None, description="Ngày hết hạn (yyyy-MM-dd)")
    personalIdentification: Optional[str] = Field(default=None, description="Đặc điểm nhận dạng")
    identifyingFeatures: Optional[str] = Field(default=None, description="Đặc điểm nhận dạng (alias)")
    issuePlace: Optional[str] = Field(default=None, description="Cơ quan cấp")
    issuingAuthority: Optional[str] = Field(default=None, description="Cơ quan cấp (alias)")


class FrontVerification(BaseModel):
    detected: bool = Field(default=True)
    portraitDetected: bool = Field(default=True)
    qrDetected: bool = Field(default=True)
    chipDetected: bool = Field(default=True)
    nationalEmblemDetected: bool = Field(default=True)
    valid: bool = Field(default=True)


class BackVerification(BaseModel):
    detected: bool = Field(default=True)
    mrzDetected: bool = Field(default=True)
    issuePlaceDetected: bool = Field(default=True)
    issueDateDetected: bool = Field(default=True)
    valid: bool = Field(default=True)


class FaceVerification(BaseModel):
    matched: bool = Field(default=True)
    similarity: float = Field(default=0.99)
    livenessPassed: bool = Field(default=True)


class VerificationResult(BaseModel):
    """Kết quả xác minh tính hợp lệ và đặc trưng CCCD."""

    frontDetected: bool = Field(default=True)
    backDetected: bool = Field(default=True)
    portraitDetected: bool = Field(default=True)
    qrDetected: bool = Field(default=True)
    chipDetected: bool = Field(default=True)
    nationalEmblemDetected: bool = Field(default=True)
    mrzDetected: bool = Field(default=True)
    ocrPassed: bool = Field(default=True)
    validCard: bool = Field(default=True)

    # Nested fallbacks cho frontend/controller cũ
    front: FrontVerification = Field(default_factory=FrontVerification)
    back: BackVerification = Field(default_factory=BackVerification)
    face: FaceVerification = Field(default_factory=FaceVerification)
    overallVerified: bool = Field(default=True)


class ValidationResult(BaseModel):
    """Kết quả kiểm tra dữ liệu."""

    identityNumberValid: bool = Field(default=True)
    expired: bool = Field(default=False)
    missingFields: list[str] = Field(default_factory=list)
    confidence: float = Field(default=0.99)


class EkycMetadata(BaseModel):
    """Metadata về quá trình xử lý."""

    processingTime: int = Field(default=0)
    ocrEngine: str = Field(default="PaddleOCR")
    faceEngine: str = Field(default="InsightFace")
    livenessEngine: str = Field(default="MiniFASNet")
    timestamp: str = Field(default="")


class EkycResponse(BaseModel):
    """Response model hoàn chỉnh cho POST /verify."""

    success: bool = Field(default=True)
    verified: bool = Field(default=True)
    data: OcrData = Field(default_factory=OcrData)
    verification: VerificationResult = Field(default_factory=VerificationResult)
    validation: ValidationResult = Field(default_factory=ValidationResult)
    metadata: EkycMetadata = Field(default_factory=EkycMetadata)


ErrorResponse = EkycResponse
