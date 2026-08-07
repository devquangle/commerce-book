"""
Regex utilities for extracting specific fields from CCCD OCR text.
"""
import re
from typing import Optional, List
from utils.text_utils import normalize_whitespace

# Core Regex Patterns
PATTERN_DATE = re.compile(r"(\d{2})[/\-\.](\d{2})[/\-\.](\d{4})")
PATTERN_GENDER = re.compile(r"(?i)\b(Nam|Nữ|Nu|Male|Female)\b")
PATTERN_ID = re.compile(r"\b(\d{9,12})\b")

# Noise patterns
NOISE_ADDRESS_PATTERNS = re.compile(
    r"(?i)\b("
    r"place\s*of\s*origin|place\s*of\s*residence|que\s*quan|noi\s*thuong\s*tru|"
    r"residence|origin|place"
    r")\b"
)

def _build_label_pattern(labels: List[str]) -> re.Pattern:
    combined = "|".join(labels)
    return re.compile(r"(?i)(?:" + combined + r")\s*[:\-\.]?\s*(.*)$")

PATTERN_LABEL_PLACE_OF_RESIDENCE = _build_label_pattern([
    r"N[oơ]i\s*th[uư][oờ]ng\s*tr[uú]",
    r"N[oơ]i\s*c[uư]\s*tr[uú]",
    r"Place\s*of\s*residence"
])

PATTERN_LABEL_PLACE_OF_ORIGIN = _build_label_pattern([
    r"Qu[eê]\s*qu[aá]n",
    r"N[oơ]i\s*sinh",
    r"N[oơ]i\s*đăng\s*ký\s*khai\s*sinh",
    r"Place\s*of\s*origin",
    r"Place\s*of\s*birth"
])

def extract_date(text: str) -> Optional[str]:
    """Tìm chuỗi ngày tháng dạng dd/mm/yyyy."""
    match = PATTERN_DATE.search(text)
    if match:
        return f"{match.group(1)}/{match.group(2)}/{match.group(3)}"
    return None

def extract_identity_number(lines: List[str]) -> Optional[str]:
    """Tìm số CCCD 12 số hoặc CMND 9 số."""
    for line in lines:
        match = PATTERN_ID.search(line)
        if match:
            return match.group(1)
    return None

def is_any_label(line: str) -> bool:
    """Kiểm tra xem dòng hiện tại có phải là một label không."""
    patterns = [
        PATTERN_LABEL_PLACE_OF_RESIDENCE,
        PATTERN_LABEL_PLACE_OF_ORIGIN,
        re.compile(r"(?i)(Họ và tên|Ngày sinh|Giới tính|Quốc tịch|Đặc điểm nhận dạng)"),
        re.compile(r"(?i)(Full name|Date of birth|Sex|Nationality|Personal identification)")
    ]
    return any(p.search(line) for p in patterns)

def clean_address(text: Optional[str]) -> Optional[str]:
    """Làm sạch chuỗi địa chỉ."""
    if not text:
        return None
    # Xóa nhãn nhiễu tiếng Anh
    text = NOISE_ADDRESS_PATTERNS.sub("", text)
    # Thêm dấu phẩy giữa chữ thường và chữ hoa bị dính
    text = re.compile(r"([a-z])([A-Z])").sub(r"\1, \2", text)
    # Loại bỏ ký tự thừa ở đầu và cuối
    text = re.sub(r"^[\s,\.\-]+", "", text)
    text = re.sub(r"[\s,\.\-]+$", "", text)
    # Thu gọn dấu phẩy liên tiếp
    text = re.sub(r"\s*,\s*", ", ", text)
    
    val = normalize_whitespace(text)
    return val if val else None
