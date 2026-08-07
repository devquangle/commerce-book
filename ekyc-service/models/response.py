"""
Response models for the eKYC Service.
Sử dụng chuẩn camelCase cho tất cả các field.
"""
from pydantic import BaseModel, ConfigDict
from typing import Optional, List, Dict, Any

class OcrData(BaseModel):
    identityNumber: Optional[str] = None
    fullName: Optional[str] = None
    dateOfBirth: Optional[str] = None
    gender: Optional[str] = None
    nationality: Optional[str] = None
    placeOfOrigin: Optional[str] = None
    placeOfResidence: Optional[str] = None
    issueDate: Optional[str] = None
    expiryDate: Optional[str] = None
    model_config = ConfigDict(populate_by_name=True)

class QrResultData(BaseModel):
    detected: bool = False
    parsed: bool = False
    data: Optional[OcrData] = None

class ValidationData(BaseModel):
    valid: bool = False
    expired: bool = False
    qrMatch: bool = False
    faceMatch: bool = False
    livenessPass: bool = False
    mismatchFields: List[str] = []

class CardResponseData(BaseModel):
    ocr: OcrData
    qr: QrResultData
    validation: ValidationData

class CardVerificationData(BaseModel):
    frontValid: bool = False
    backValid: bool = False
    frontDetected: bool = False
    backDetected: bool = False
    frontPortrait: bool = False
    frontEmblem: bool = False
    frontChip: bool = False
    backMrz: bool = False
    backChip: bool = False
    backIssuePlace: bool = False
    backIssueDate: bool = False
    ocrPassed: bool = False

class FaceData(BaseModel):
    matched: bool = False
    similarity: float = 0.0
    threshold: float = 0.0

class LivenessData(BaseModel):
    isLive: bool = False
    score: float = 0.0
    attackType: Optional[str] = None
    provider: str = "PlaceLive"

class VerifyResponseData(BaseModel):
    ocr: OcrData
    qr: QrResultData
    validation: ValidationData
    face: FaceData
    liveness: LivenessData
