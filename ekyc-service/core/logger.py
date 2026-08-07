"""
Global Logger configuration for the eKYC Service.
"""
import logging
import sys
import os
from logging.handlers import RotatingFileHandler
from core.config import settings

def setup_logger(name: str = "ekyc") -> logging.Logger:
    """
    Khởi tạo và cấu hình Logger theo Singleton.
    Lưu log ra file và console tùy theo LOG_LEVEL.
    """
    logger = logging.getLogger(name)
    
    # Nếu logger đã có handlers thì không cấu hình lại
    if logger.hasHandlers():
        return logger

    # Lấy log level từ config
    level_name = settings.LOG_LEVEL.upper()
    log_level = getattr(logging, level_name, logging.INFO)
    logger.setLevel(log_level)

    formatter = logging.Formatter(
        fmt="%(asctime)s | %(levelname)-8s | %(module)s.%(funcName)s | %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S"
    )

    # Console Handler
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setFormatter(formatter)
    logger.addHandler(console_handler)

    # File Handler
    log_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "logs")
    os.makedirs(log_dir, exist_ok=True)
    log_file = os.path.join(log_dir, "app.log")
    
    # Giới hạn file log 10MB, xoay vòng 5 file
    file_handler = RotatingFileHandler(log_file, maxBytes=10*1024*1024, backupCount=5, encoding="utf-8")
    file_handler.setFormatter(formatter)
    logger.addHandler(file_handler)

    # Prevent logging from propagating to the root logger
    logger.propagate = False

    return logger

# Tạo instance logger dùng chung cho toàn bộ app
logger = setup_logger()
