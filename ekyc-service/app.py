"""
Main Entrypoint for the eKYC Service.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from core.config import settings
from core.logger import logger
from core.middleware import RequestLoggingMiddleware
from core.exception import global_exception_handler, EkycException
from api import ekyc

# Initialize FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="REST API eKYC Production Ready cho CCCD Việt Nam",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Custom Logging Middleware
app.add_middleware(RequestLoggingMiddleware)

# Global Exception Handlers
app.add_exception_handler(Exception, global_exception_handler)
app.add_exception_handler(EkycException, global_exception_handler)

# Include Routers
app.include_router(ekyc.router, prefix="/api/v1/ekyc", tags=["eKYC"])

@app.get("/api/v1/health", tags=["Health"])
def health_check():
    """Health check endpoint."""
    return {"status": "UP", "version": settings.APP_VERSION}

@app.on_event("startup")
async def startup_event():
    logger.info(f"Starting {settings.APP_NAME} v{settings.APP_VERSION}")
    # Trigger AI Models Initialization
    from services.ocr_service import ocr_service
    logger.info("Application startup completed.")

if __name__ == "__main__":
    logger.info(f"Starting server on {settings.HOST}:{settings.PORT}")
    uvicorn.run("app:app", host=settings.HOST, port=settings.PORT, reload=settings.DEBUG)
