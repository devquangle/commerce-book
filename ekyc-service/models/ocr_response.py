"""
models/ocr_response.py

Pydantic model đại diện cho kết quả OCR trích xuất từ CCCD Việt Nam.
Tất cả các trường đều Optional vì không phải lúc nào OCR cũng đọc được đủ thông tin.
"""

from typing import Optional
from pydantic import BaseModel, Field


class OcrResult(BaseModel):
    """
    Kết quả OCR từ ảnh CCCD (Căn Cước Công Dân) Việt Nam.

    Tất cả các trường đều có thể null nếu OCR không nhận diện được.
    """

    identityNumber: Optional[str] = Field(
        default=None,
        description="Số CCCD gồm 12 chữ số",
        examples=["001234567890"],
    )

    fullName: Optional[str] = Field(
        default=None,
        description="Họ và tên đầy đủ trên CCCD",
        examples=["NGUYỄN VĂN AN"],
    )

    dateOfBirth: Optional[str] = Field(
        default=None,
        description="Ngày sinh định dạng DD/MM/YYYY",
        examples=["15/08/1990"],
    )

    gender: Optional[str] = Field(
        default=None,
        description="Giới tính: Nam hoặc Nữ",
        examples=["Nam"],
    )

    nationality: Optional[str] = Field(
        default=None,
        description="Quốc tịch",
        examples=["Việt Nam"],
    )

    placeOfResidence: Optional[str] = Field(
        default=None,
        description="Nơi thường trú / Nơi cư trú",
        examples=["123 Đường ABC, Quận 1, TP. Hồ Chí Minh"],
    )



    issueDate: Optional[str] = Field(
        default=None,
        description="Ngày cấp CCCD định dạng DD/MM/YYYY",
        examples=["20/01/2022"],
    )

    expiryDate: Optional[str] = Field(
        default=None,
        description="Ngày hết hạn CCCD định dạng DD/MM/YYYY (None nếu không thời hạn)",
        examples=["20/01/2032"],
    )



    class Config:
        json_schema_extra = {
            "example": {
                "identityNumber": "001234567890",
                "fullName": "NGUYỄN VĂN AN",
                "dateOfBirth": "15/08/1990",
                "gender": "Nam",
                "nationality": "Việt Nam",
                "placeOfResidence": "123 Đường ABC, Quận 1, TP. Hồ Chí Minh",
                "issueDate": "20/01/2022",
                "expiryDate": "20/01/2032",
            }
        }
