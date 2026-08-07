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

    placeOfOrigin: Optional[str] = Field(
        default=None,
        description="Quê quán",
        examples=["Hà Nội"],
    )

    placeOfResidence: Optional[str] = Field(
        default=None,
        description="Nơi thường trú",
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

    personalIdentification: Optional[str] = Field(
        default=None,
        description="Đặc điểm nhận dạng ở mặt sau CCCD",
        examples=["Sẹo chấm C 1,5 cm trên sau cánh mũi phải"],
    )

    issuePlace: Optional[str] = Field(
        default=None,
        description="Nơi cấp / Cơ quan cấp CCCD ở mặt sau",
        examples=["CỤC TRƯỞNG CỤC CẢNH SÁT QUẢN LÝ HÀNH CHÍNH VỀ TRẬT TỰ XÃ HỘI"],
    )

    class Config:
        json_schema_extra = {
            "example": {
                "identityNumber": "001234567890",
                "fullName": "NGUYỄN VĂN AN",
                "dateOfBirth": "15/08/1990",
                "gender": "Nam",
                "nationality": "Việt Nam",
                "placeOfOrigin": "Hà Nội",
                "placeOfResidence": "123 Đường ABC, Quận 1, TP. Hồ Chí Minh",
                "issueDate": "20/01/2022",
                "expiryDate": "20/01/2032",
                "personalIdentification": "Sẹo chấm C 1,5 cm trên sau cánh mũi phải",
                "issuePlace": "CỤC TRƯỞNG CỤC CẢNH SÁT QUẢN LÝ HÀNH CHÍNH VỀ TRẬT TỰ XÃ HỘI",
            }
        }
