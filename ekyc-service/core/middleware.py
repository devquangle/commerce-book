"""
Middleware configuration for the eKYC Service.
"""
import time
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from utils.response import generate_request_id
from core.logger import logger

class RequestLoggingMiddleware(BaseHTTPMiddleware):
    """
    Middleware để tự động sinh request ID, đo thời gian xử lý và log thông tin request/response.
    """
    async def dispatch(self, request: Request, call_next):
        request_id = generate_request_id()
        # Đính kèm request_id vào state để sử dụng ở các controller/service
        request.state.request_id = request_id
        
        start_time = time.time()
        
        logger.info(f"[{request_id}] Started {request.method} {request.url.path}")
        
        try:
            response = await call_next(request)
            process_time = time.time() - start_time
            logger.info(f"[{request_id}] Completed in {process_time:.3f}s with status {response.status_code}")
            
            # Thêm header X-Request-ID cho client
            response.headers["X-Request-ID"] = request_id
            response.headers["X-Process-Time"] = str(process_time)
            
            return response
        except Exception as e:
            process_time = time.time() - start_time
            logger.error(f"[{request_id}] Failed in {process_time:.3f}s with error: {str(e)}")
            raise e
