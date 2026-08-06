"""
app.py

Entry point của eKYC Service.

Khởi tạo FastAPI application với:
- CORS middleware
- Lifespan context (load AI models khi startup)
- Router đăng ký
- Global exception handler
- Logging configuration

Chạy với:
    uvicorn app:app --host 0.0.0.0 --port 8000 --reload
"""

import logging
import sys
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from api.ekyc_controller import router as ekyc_router
from services.face_service import face_service
from services.ocr_service import ocr_service
from utils.image_utils import ensure_directories

# ---------------------------------------------------------------------------
# LOGGING CONFIGURATION
# ---------------------------------------------------------------------------

def configure_logging() -> None:
    """Cấu hình logging cho toàn bộ ứng dụng."""
    log_format = (
        "%(asctime)s | %(levelname)-8s | %(name)-30s | %(message)s"
    )
    logging.basicConfig(
        level=logging.INFO,
        format=log_format,
        datefmt="%Y-%m-%d %H:%M:%S",
        handlers=[
            logging.StreamHandler(sys.stdout),
        ],
    )
    # Tắt bớt log verbose từ các thư viện bên ngoài
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)
    logging.getLogger("paddleocr").setLevel(logging.WARNING)
    logging.getLogger("paddle").setLevel(logging.WARNING)
    logging.getLogger("ppocr").setLevel(logging.WARNING)


configure_logging()
logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# LIFESPAN – Startup & Shutdown
# ---------------------------------------------------------------------------

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Quản lý vòng đời ứng dụng.

    Startup:
        - Tạo thư mục uploads/ và temp/
        - Khởi tạo PaddleOCR model
        - Khởi tạo InsightFace model

    Shutdown:
        - Log thông báo tắt server
    """
    # -----------------------------------------------------------------------
    # STARTUP
    # -----------------------------------------------------------------------
    logger.info("=" * 70)
    logger.info("  eKYC Service đang khởi động...")
    logger.info("=" * 70)

    # Tạo thư mục cần thiết
    ensure_directories()
    logger.info("✓ Thư mục uploads/ và temp/ đã sẵn sàng.")

    # Khởi tạo PaddleOCR (load model vào RAM)
    try:
        logger.info("Đang tải PaddleOCR model (lần đầu có thể mất 1-2 phút)...")
        ocr_service.initialize()
        logger.info("✓ PaddleOCR model đã sẵn sàng.")
    except Exception as e:
        logger.error(f"✗ Lỗi khởi tạo PaddleOCR: {e}")
        logger.warning("Service sẽ chạy nhưng chức năng OCR sẽ không hoạt động.")

    # Khởi tạo InsightFace (download + load model buffalo_l)
    try:
        logger.info(
            "Đang tải InsightFace buffalo_l model "
            "(lần đầu tải về ~500MB, có thể mất vài phút)..."
        )
        face_service.initialize(model_name="buffalo_l")
        logger.info("✓ InsightFace model đã sẵn sàng.")
    except Exception as e:
        logger.error(f"✗ Lỗi khởi tạo InsightFace: {e}")
        logger.warning("Service sẽ chạy nhưng chức năng face verification sẽ không hoạt động.")

    logger.info("=" * 70)
    logger.info("  eKYC Service khởi động THÀNH CÔNG!")
    logger.info("  Tài liệu API: http://localhost:8000/docs")
    logger.info("  Health check: http://localhost:8000/health")
    logger.info("=" * 70)

    yield  # Ứng dụng chạy ở đây

    # -----------------------------------------------------------------------
    # SHUTDOWN
    # -----------------------------------------------------------------------
    logger.info("eKYC Service đang tắt... Tạm biệt!")


# ---------------------------------------------------------------------------
# FASTAPI APPLICATION
# ---------------------------------------------------------------------------

app = FastAPI(
    title="eKYC Service",
    description=(
        "Microservice xác minh danh tính điện tử (eKYC) cho CCCD Việt Nam.\n\n"
        "## Tính năng\n"
        "- **OCR** trích xuất thông tin từ CCCD bằng PaddleOCR\n"
        "- **Face Verification** so khớp khuôn mặt bằng InsightFace (buffalo_l)\n"
        "- **REST API** tích hợp dễ dàng với Spring Boot, React, v.v.\n\n"
        "## Sử dụng\n"
        "Gửi ảnh CCCD và ảnh selfie tới `POST /verify` để nhận kết quả xác minh."
    ),
    version="1.0.0",
    contact={
        "name": "eKYC Service",
        "url": "https://github.com/your-repo/ekyc-service",
    },
    license_info={
        "name": "MIT",
    },
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)


# ---------------------------------------------------------------------------
# MIDDLEWARE
# ---------------------------------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],          # Production: thay bằng domain cụ thể
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# GLOBAL EXCEPTION HANDLERS
# ---------------------------------------------------------------------------

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """
    Global exception handler – bắt tất cả các exception không được xử lý.

    Trả về JSON response thay vì HTML error page mặc định.
    """
    logger.error(
        f"Unhandled exception tại {request.method} {request.url}: {exc}",
        exc_info=True,
    )
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "message": "Internal server error",
            "detail": str(exc) if app.debug else "An unexpected error occurred",
        },
    )


# ---------------------------------------------------------------------------
# ROUTES
# ---------------------------------------------------------------------------

app.include_router(ekyc_router)


# ---------------------------------------------------------------------------
# ROOT ENDPOINT
# ---------------------------------------------------------------------------

@app.get("/", tags=["Root"], summary="Service Info")
async def root() -> dict:
    """Thông tin cơ bản của eKYC Service."""
    return {
        "service": "eKYC Service",
        "version": "1.0.0",
        "description": "OCR + Face Verification cho CCCD Việt Nam",
        "endpoints": {
            "verify": "POST /verify",
            "health": "GET /health",
            "docs": "GET /docs",
        },
    }


# ---------------------------------------------------------------------------
# MAIN
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "app:app",
        host="0.0.0.0",
        port=8000,
        reload=True,             # Hot reload khi dev
        log_level="info",
        access_log=True,
    )
