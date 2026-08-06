"""
models/ekyc_response.py

Pydantic model đại diện cho toàn bộ kết quả eKYC,
bao gồm kết quả xác minh khuôn mặt và thông tin OCR.
"""

from typing import Optional
from pydantic import BaseModel, Field

from models.ocr_response import OcrResult


class EkycResponse(BaseModel):
    """
    Response model cho API POST /verify.

    Trả về kết quả đầy đủ của quy trình eKYC:
    - Trạng thái thành công/thất bại
    - Kết quả so khớp khuôn mặt (verified, similarity)
    - Thông tin OCR trích xuất từ CCCD
    """

    success: bool = Field(
        description="True nếu quy trình eKYC hoàn tất không có lỗi hệ thống"
    )

    message: str = Field(
        description="Thông báo mô tả kết quả hoặc lý do thất bại"
    )

    verified: Optional[bool] = Field(
        default=None,
        description="True nếu khuôn mặt selfie khớp với ảnh trên CCCD",
    )

    similarity: Optional[float] = Field(
        default=None,
        description="Điểm cosine similarity giữa hai khuôn mặt (0.0 - 1.0)",
        ge=0.0,
        le=1.0,
    )

    threshold: float = Field(
        default=0.75,
        description="Ngưỡng similarity để xác nhận verified=true",
    )

    ocr: Optional[OcrResult] = Field(
        default=None,
        description="Thông tin OCR trích xuất từ CCCD",
    )

    class Config:
        json_schema_extra = {
            "example": {
                "success": True,
                "message": "Verification completed",
                "verified": True,
                "similarity": 0.91,
                "threshold": 0.75,
                "ocr": {
                    "identityNumber": "001234567890",
                    "fullName": "NGUYỄN VĂN AN",
                    "dateOfBirth": "15/08/1990",
                    "gender": "Nam",
                    "nationality": "Việt Nam",
                    "placeOfOrigin": "Hà Nội",
                    "placeOfResidence": "123 Đường ABC, Quận 1, TP. Hồ Chí Minh",
                    "issueDate": "20/01/2022",
                },
            }
        }


class ErrorResponse(BaseModel):
    """Response model cho các lỗi đơn giản (không có OCR data)."""

    success: bool = Field(default=False)
    message: str = Field(description="Mô tả lỗi")
    verified: Optional[bool] = Field(default=None)
    similarity: Optional[float] = Field(default=None)
    threshold: float = Field(default=0.75)
    ocr: Optional[OcrResult] = Field(default=None)
