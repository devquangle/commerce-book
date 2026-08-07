"""
Utility functions for text normalization and processing.
"""
import re
import unicodedata
from typing import Optional

def normalize_unicode(text: Optional[str]) -> Optional[str]:
    """Chuẩn hóa unicode về dạng NFC."""
    if not text:
        return text
    return unicodedata.normalize("NFC", text)

def normalize_whitespace(text: Optional[str]) -> str:
    """Loại bỏ khoảng trắng thừa."""
    if not text:
        return ""
    return re.sub(r"\s+", " ", str(text)).strip()

def clean_text(text: Optional[str]) -> str:
    """
    Làm sạch text, loại bỏ các ký tự đặc biệt không thuộc văn bản thông thường.
    """
    if not text:
        return ""
    text_norm = normalize_unicode(text)
    cleaned = re.sub(r"[^\w\s\.,\-\/]", "", text_norm or "")
    return normalize_whitespace(cleaned)

def convert_date_to_iso(date_str: Optional[str]) -> Optional[str]:
    """
    Chuyển đổi ngày tháng từ định dạng dd/mm/yyyy sang yyyy-mm-dd.
    """
    if not date_str:
        return None
    parts = date_str.split("/")
    if len(parts) == 3:
        return f"{parts[2]}-{parts[1].zfill(2)}-{parts[0].zfill(2)}"
    return date_str
