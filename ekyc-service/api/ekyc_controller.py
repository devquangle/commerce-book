"""
api/ekyc_controller.py

FastAPI Router (Controller) cho eKYC API.

Endpoint:
    POST /verify

Trách nhiệm:
- Nhận và validate multipart/form-data (idCard, selfie)
- Lưu file tạm
- Gọi EkycService để xử lý
- Xóa file tạm sau khi xong
- Trả về EkycResponse

Không chứa business logic, chỉ làm nhiệm vụ HTTP layer.
"""

import logging
from typing import Annotated

from fastapi import APIRouter, File, HTTPException, UploadFile, status
from fastapi.responses import JSONResponse

from models.ekyc_response import EkycResponse
from services.ekyc_service import EkycService
from services.face_service import face_service
from services.ocr_service import ocr_service
from utils.image_utils import delete_temp_file, save_temp_image

logger = logging.getLogger(__name__)

router = APIRouter(prefix="", tags=["eKYC"])

# Kích thước file tối đa: 10MB
MAX_FILE_SIZE_MB = 10
MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024

# Các định dạng ảnh được chấp nhận
ALLOWED_CONTENT_TYPES = {
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/bmp",
}


def get_ekyc_service() -> EkycService:
    """
    Factory function để tạo EkycService với các dependency đã sẵn sàng.

    Returns:
        EkycService instance.
    """
    return EkycService(
        ocr_service=ocr_service,
        face_service=face_service,
    )


@router.post(
    "/verify",
    response_model=EkycResponse,
    summary="eKYC Verification",
    description=(
        "Xác minh danh tính bằng cách so khớp ảnh selfie với ảnh trên CCCD Việt Nam. "
        "Trích xuất thông tin OCR từ CCCD và thực hiện face verification."
    ),
    responses={
        200: {
            "description": "Kết quả xác minh eKYC",
            "content": {
                "application/json": {
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
                            "placeOfResidence": "123 Đường ABC, Quận 1, TP. HCM",
                            "issueDate": "20/01/2022",
                        },
                    }
                }
            },
        },
        400: {"description": "File không hợp lệ (sai định dạng, quá lớn)"},
        422: {"description": "Validation error"},
        500: {"description": "Lỗi server nội bộ"},
    },
)
async def verify_ekyc(
    idCard: Annotated[
        UploadFile,
        File(description="Ảnh CCCD Việt Nam (JPEG/PNG/WEBP, tối đa 10MB)"),
    ],
    selfie: Annotated[
        UploadFile,
        File(description="Ảnh selfie người dùng (JPEG/PNG/WEBP, tối đa 10MB)"),
    ],
) -> EkycResponse:
    """
    POST /verify – Endpoint chính cho eKYC.

    Nhận hai ảnh qua multipart/form-data:
    - **idCard**: Ảnh mặt trước CCCD Việt Nam
    - **selfie**: Ảnh selfie của người dùng

    Trả về:
    - Thông tin OCR từ CCCD
    - Kết quả so khớp khuôn mặt (similarity score + verified flag)
    """
    logger.info(
        f"Nhận request POST /verify: "
        f"idCard='{idCard.filename}' ({idCard.content_type}), "
        f"selfie='{selfie.filename}' ({selfie.content_type})"
    )

    # Validate input files
    _validate_upload_file(idCard, "idCard")
    _validate_upload_file(selfie, "selfie")

    id_card_path: str | None = None
    selfie_path: str | None = None

    try:
        # ---------------------------------------------------------------
        # BƯỚC 1: Đọc và lưu file tạm
        # ---------------------------------------------------------------
        logger.info("[BƯỚC 1] Đang lưu file tạm...")

        id_card_bytes = await idCard.read()
        selfie_bytes = await selfie.read()

        # Kiểm tra kích thước sau khi đọc
        _check_file_size(id_card_bytes, "idCard")
        _check_file_size(selfie_bytes, "selfie")

        id_card_path = save_temp_image(id_card_bytes, prefix="idcard")
        selfie_path = save_temp_image(selfie_bytes, prefix="selfie")
        logger.info(f"[BƯỚC 1] Đã lưu: idCard={id_card_path}, selfie={selfie_path}")

        # ---------------------------------------------------------------
        # BƯỚC 2-5: Xử lý eKYC
        # ---------------------------------------------------------------
        ekyc_svc = get_ekyc_service()
        response = await ekyc_svc.process_ekyc(
            id_card_path=id_card_path,
            selfie_path=selfie_path,
        )

        logger.info(
            f"Hoàn tất POST /verify: success={response.success}, "
            f"verified={response.verified}, similarity={response.similarity}"
        )
        return response

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Lỗi không mong muốn trong POST /verify: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error during eKYC processing",
        )
    finally:
        # ---------------------------------------------------------------
        # Dọn dẹp file tạm (luôn chạy, kể cả khi có exception)
        # ---------------------------------------------------------------
        if id_card_path:
            delete_temp_file(id_card_path)
        if selfie_path:
            delete_temp_file(selfie_path)
        logger.debug("Đã dọn dẹp file tạm.")


@router.get(
    "/health",
    summary="Health Check",
    description="Kiểm tra trạng thái hoạt động của service và các model AI.",
    tags=["Health"],
)
async def health_check() -> dict:
    """
    GET /health – Health check endpoint.

    Kiểm tra trạng thái:
    - OCR Service (PaddleOCR)
    - Face Service (InsightFace)
    """
    return {
        "status": "healthy",
        "services": {
            "ocr": "ready" if ocr_service.is_initialized else "not_initialized",
            "face": "ready" if face_service.is_initialized else "not_initialized",
        },
    }


# ------------------------------------------------------------------
# PRIVATE VALIDATION HELPERS
# ------------------------------------------------------------------

def _validate_upload_file(file: UploadFile, field_name: str) -> None:
    """
    Validate content type của file upload.

    Args:
        file: UploadFile object.
        field_name: Tên field ('idCard' hoặc 'selfie') để hiển thị trong lỗi.

    Raises:
        HTTPException(400): Nếu content type không hợp lệ.
    """
    content_type = file.content_type or ""
    if content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                f"'{field_name}' có content type không hợp lệ: '{content_type}'. "
                f"Chấp nhận: {', '.join(sorted(ALLOWED_CONTENT_TYPES))}"
            ),
        )


def _check_file_size(data: bytes, field_name: str) -> None:
    """
    Kiểm tra kích thước file không vượt quá giới hạn.

    Args:
        data: Bytes của file đã đọc.
        field_name: Tên field để hiển thị trong lỗi.

    Raises:
        HTTPException(400): Nếu file quá lớn.
    """
    if len(data) > MAX_FILE_SIZE_BYTES:
        size_mb = len(data) / (1024 * 1024)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                f"'{field_name}' quá lớn: {size_mb:.1f}MB. "
                f"Tối đa: {MAX_FILE_SIZE_MB}MB."
            ),
        )
