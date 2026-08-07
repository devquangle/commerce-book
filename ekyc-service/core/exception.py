"""
Global Exception Handler and Custom Exceptions.
"""
from fastapi import Request
from fastapi.responses import JSONResponse
from core.logger import logger
from utils.response import error_response

class EkycException(Exception):
    """
    Base Exception cho toàn bộ hệ thống eKYC.
    """
    def __init__(self, message: str, error_code: str = "INTERNAL_ERROR", status_code: int = 400):
        self.message = message
        self.error_code = error_code
        self.status_code = status_code

class ValidationException(EkycException):
    """
    Lỗi khi dữ liệu input không hợp lệ.
    """
    def __init__(self, message: str = "Invalid input data"):
        super().__init__(message, error_code="VALIDATION_ERROR", status_code=400)

class OcrException(EkycException):
    """
    Lỗi trong quá trình OCR.
    """
    def __init__(self, message: str = "OCR processing failed"):
        super().__init__(message, error_code="OCR_ERROR", status_code=500)

class FaceVerifyException(EkycException):
    """
    Lỗi trong quá trình so khớp khuôn mặt.
    """
    def __init__(self, message: str = "Face verification failed"):
        super().__init__(message, error_code="FACE_VERIFY_ERROR", status_code=500)

class LivenessException(EkycException):
    """
    Lỗi trong quá trình kiểm tra Liveness.
    """
    def __init__(self, message: str = "Liveness check failed"):
        super().__init__(message, error_code="LIVENESS_ERROR", status_code=500)

async def global_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """
    Bắt mọi exception chưa được handle trong API và trả về JSON chuẩn.
    """
    if isinstance(exc, EkycException):
        logger.error(f"[EkycException] {exc.error_code}: {exc.message}")
        request_id = getattr(request.state, "request_id", "")
        return error_response(
            message=exc.message,
            error_code=exc.error_code,
            request_id=request_id,
            status_code=exc.status_code
        )
    
    # Bắt lỗi không lường trước
    logger.exception(f"[Unhandled Exception] {str(exc)}")
    request_id = getattr(request.state, "request_id", "")
    return error_response(
        message="Internal server error",
        error_code="INTERNAL_SERVER_ERROR",
        request_id=request_id,
        status_code=500
    )
