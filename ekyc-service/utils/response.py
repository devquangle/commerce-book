"""
Utility functions for formatting API responses.
"""
from fastapi.responses import JSONResponse
from datetime import datetime, timezone
import uuid
from typing import Any, Dict, Optional

def generate_request_id() -> str:
    """Sinh request ID duy nhất cho mỗi yêu cầu."""
    return str(uuid.uuid4())

def get_current_timestamp() -> str:
    """Lấy timestamp hiện tại theo chuẩn ISO 8601."""
    return datetime.now(timezone.utc).isoformat()

def success_response(data: Any, message: str = "Success", request_id: str = "") -> JSONResponse:
    """
    Trả về response thành công theo chuẩn.
    """
    content = {
        "success": True,
        "message": message,
        "data": data,
        "timestamp": get_current_timestamp(),
        "requestId": request_id or generate_request_id()
    }
    return JSONResponse(status_code=200, content=content)

def error_response(message: str, error_code: str, request_id: str = "", status_code: int = 400) -> JSONResponse:
    """
    Trả về response lỗi theo chuẩn.
    """
    content = {
        "success": False,
        "message": message,
        "errorCode": error_code,
        "timestamp": get_current_timestamp(),
        "requestId": request_id or generate_request_id()
    }
    return JSONResponse(status_code=status_code, content=content)
