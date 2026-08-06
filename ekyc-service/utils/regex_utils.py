"""
utils/regex_utils.py

Các pattern Regex và hàm tiện ích để trích xuất thông tin
từ danh sách text dòng OCR của CCCD Việt Nam.

Xử lý cả CCCD mới (chip-based) và CMND cũ.
"""

import logging
import re
from typing import Optional

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# REGEX PATTERNS
# ---------------------------------------------------------------------------

# Số CCCD: 12 chữ số liên tiếp (không dính chữ)
PATTERN_IDENTITY_NUMBER = re.compile(r'\b(\d{12})\b')

# Ngày tháng năm: DD/MM/YYYY hoặc DD-MM-YYYY
PATTERN_DATE = re.compile(r'\b(\d{1,2}[/\-\.]\d{1,2}[/\-\.]\d{4})\b')

# Giới tính - tiếng Việt và tiếng Anh (trên CCCD mới có song ngữ)
PATTERN_GENDER = re.compile(
    r'\b(Nam|Nữ|Nu|Male|Female|MALE|FEMALE|NAM|NỮ|NU)\b',
    re.IGNORECASE
)

# Quốc tịch
PATTERN_NATIONALITY = re.compile(
    r'\b(Việt Nam|Viet Nam|Vietnam|VIỆT NAM|VIET NAM|VIETNAM)\b',
    re.IGNORECASE
)

# Nhãn (label) trên CCCD - dùng để tìm dòng kế tiếp
# Hỗ trợ cả tiếng Việt (có dấu) và không dấu (OCR lỗi)
LABELS_FULL_NAME = [
    r'Họ\s*(?:và|va)\s*tên',
    r'Ho\s*(?:va|và)\s*ten',
    r'Full\s*name',
    r'Fullname',
    r'HỌ\s*VÀ\s*TÊN',
]

LABELS_DATE_OF_BIRTH = [
    r'Ngày\s*(?:,\s*)?tháng\s*(?:,\s*)?năm\s*sinh',
    r'Ngay\s*sinh',
    r'Date\s*of\s*birth',
    r'DOB',
    r'NGÀY\s*SINH',
    r'Sinh\s*ngày',
]

LABELS_PLACE_OF_ORIGIN = [
    r'Quê\s*quán',
    r'Que\s*quan',
    r'Place\s*of\s*origin',
    r'QUÊ\s*QUÁN',
    r'Nguyên\s*quán',
]

LABELS_PLACE_OF_RESIDENCE = [
    r'Nơi\s*thường\s*trú',
    r'Noi\s*thuong\s*tru',
    r'Place\s*of\s*residence',
    r'NƠI\s*THƯỜNG\s*TRÚ',
    r'Địa\s*chỉ',
]

LABELS_ISSUE_DATE = [
    r'Ngày\s*(?:,\s*)?tháng\s*(?:,\s*)?năm\s*cấp',
    r'Ngay\s*cap',
    r'Date\s*of\s*issue',
    r'CÓ\s*GIÁ\s*TRỊ\s*ĐẾN',
    r'Ngày\s*cấp',
    r'Date\s*of\s*expiry',
]

# Các từ cần loại bỏ khi parse họ tên (thường là label bị lẫn vào)
NOISE_WORDS_NAME = [
    'CỘNG HÒA', 'XÃ HỘI', 'CHỦ NGHĨA', 'VIỆT NAM', 'ĐỘC LẬP', 'TỰ DO',
    'HẠNH PHÚC', 'CĂN CƯỚC', 'CÔNG DÂN', 'IDENTITY CARD', 'NATIONAL ID',
    'BỘ CÔNG AN', 'MINISTRY', 'SOCIALIST', 'REPUBLIC', 'INDEPENDENCE',
    'FREEDOM', 'HAPPINESS',
]


# ---------------------------------------------------------------------------
# HELPER FUNCTIONS
# ---------------------------------------------------------------------------

def build_label_pattern(labels: list[str]) -> re.Pattern:
    """
    Tạo compiled regex pattern từ danh sách label strings.

    Args:
        labels: Danh sách các label pattern string.

    Returns:
        Compiled regex pattern.
    """
    combined = '|'.join(f'(?:{label})' for label in labels)
    return re.compile(combined, re.IGNORECASE)


# Pre-compile các label patterns
PATTERN_LABEL_FULL_NAME = build_label_pattern(LABELS_FULL_NAME)
PATTERN_LABEL_DATE_OF_BIRTH = build_label_pattern(LABELS_DATE_OF_BIRTH)
PATTERN_LABEL_PLACE_OF_ORIGIN = build_label_pattern(LABELS_PLACE_OF_ORIGIN)
PATTERN_LABEL_PLACE_OF_RESIDENCE = build_label_pattern(LABELS_PLACE_OF_RESIDENCE)
PATTERN_LABEL_ISSUE_DATE = build_label_pattern(LABELS_ISSUE_DATE)


def extract_identity_number(lines: list[str]) -> Optional[str]:
    """
    Trích xuất số CCCD 12 chữ số từ danh sách dòng text.

    Args:
        lines: Danh sách các dòng text từ OCR.

    Returns:
        Số CCCD hoặc None.
    """
    for line in lines:
        match = PATTERN_IDENTITY_NUMBER.search(line)
        if match:
            number = match.group(1)
            logger.debug(f"Tìm thấy số CCCD: {number}")
            return number
    return None


def extract_after_label(
    lines: list[str],
    label_pattern: re.Pattern,
    max_lines_ahead: int = 3
) -> Optional[str]:
    """
    Trích xuất text xuất hiện sau một label trên CCCD.

    Hỗ trợ hai trường hợp:
    1. Label và giá trị nằm trên cùng một dòng: "Họ và tên: NGUYỄN VĂN AN"
    2. Giá trị nằm trên dòng tiếp theo sau label.

    Args:
        lines: Danh sách dòng OCR.
        label_pattern: Compiled regex pattern của label.
        max_lines_ahead: Số dòng tối đa tra tìm sau label.

    Returns:
        Text giá trị đã trim, hoặc None.
    """
    for i, line in enumerate(lines):
        if label_pattern.search(line):
            # Thử lấy phần sau dấu ':' trên cùng dòng
            after_colon = re.split(r'[:：]', line, maxsplit=1)
            if len(after_colon) > 1:
                value = after_colon[1].strip()
                if value and len(value) > 1:
                    logger.debug(f"Tìm thấy giá trị sau label (same line): '{value}'")
                    return value

            # Nếu không có giá trị trên cùng dòng, tìm dòng tiếp theo
            for j in range(1, max_lines_ahead + 1):
                if i + j < len(lines):
                    next_line = lines[i + j].strip()
                    # Bỏ qua dòng trống hoặc dòng là label khác
                    if next_line and not _is_label_line(next_line):
                        logger.debug(f"Tìm thấy giá trị sau label (next line): '{next_line}'")
                        return next_line
    return None


def _is_label_line(line: str) -> bool:
    """
    Kiểm tra xem một dòng có phải là label trên CCCD không.

    Args:
        line: Dòng text cần kiểm tra.

    Returns:
        True nếu là label.
    """
    patterns = [
        PATTERN_LABEL_FULL_NAME,
        PATTERN_LABEL_DATE_OF_BIRTH,
        PATTERN_LABEL_PLACE_OF_ORIGIN,
        PATTERN_LABEL_PLACE_OF_RESIDENCE,
        PATTERN_LABEL_ISSUE_DATE,
    ]
    return any(p.search(line) for p in patterns)


def extract_first_date(lines: list[str]) -> Optional[str]:
    """
    Trích xuất ngày tháng năm đầu tiên tìm thấy trong danh sách dòng.
    Dùng cho Ngày sinh.

    Args:
        lines: Danh sách dòng OCR.

    Returns:
        Chuỗi ngày định dạng DD/MM/YYYY hoặc None.
    """
    for line in lines:
        match = PATTERN_DATE.search(line)
        if match:
            date_str = normalize_date(match.group(1))
            logger.debug(f"Tìm thấy ngày đầu tiên: {date_str}")
            return date_str
    return None


def extract_last_date(lines: list[str]) -> Optional[str]:
    """
    Trích xuất ngày tháng năm cuối cùng tìm thấy trong danh sách dòng.
    Dùng cho Ngày cấp (thường nằm ở cuối CCCD).

    Args:
        lines: Danh sách dòng OCR.

    Returns:
        Chuỗi ngày định dạng DD/MM/YYYY hoặc None.
    """
    last_date = None
    for line in lines:
        match = PATTERN_DATE.search(line)
        if match:
            last_date = normalize_date(match.group(1))
    if last_date:
        logger.debug(f"Tìm thấy ngày cuối cùng: {last_date}")
    return last_date


def extract_all_dates(lines: list[str]) -> list[str]:
    """
    Trích xuất tất cả các ngày tháng năm từ danh sách dòng.

    Args:
        lines: Danh sách dòng OCR.

    Returns:
        Danh sách các chuỗi ngày.
    """
    dates = []
    for line in lines:
        for match in PATTERN_DATE.finditer(line):
            dates.append(normalize_date(match.group(1)))
    return dates


def extract_gender(lines: list[str]) -> Optional[str]:
    """
    Trích xuất giới tính từ danh sách dòng.
    Chuẩn hóa về 'Nam' hoặc 'Nữ'.

    Args:
        lines: Danh sách dòng OCR.

    Returns:
        'Nam', 'Nữ' hoặc None.
    """
    for line in lines:
        match = PATTERN_GENDER.search(line)
        if match:
            raw = match.group(1).strip().lower()
            if raw in ('nam', 'male'):
                logger.debug("Tìm thấy giới tính: Nam")
                return 'Nam'
            elif raw in ('nữ', 'nu', 'female'):
                logger.debug("Tìm thấy giới tính: Nữ")
                return 'Nữ'
    return None


def extract_nationality(lines: list[str]) -> Optional[str]:
    """
    Trích xuất quốc tịch từ danh sách dòng.

    Args:
        lines: Danh sách dòng OCR.

    Returns:
        'Việt Nam' hoặc None.
    """
    for line in lines:
        if PATTERN_NATIONALITY.search(line):
            logger.debug("Tìm thấy quốc tịch: Việt Nam")
            return 'Việt Nam'
    return None


def normalize_date(date_str: str) -> str:
    """
    Chuẩn hóa chuỗi ngày về định dạng DD/MM/YYYY.

    Args:
        date_str: Chuỗi ngày tháng năm gốc (có thể dùng / - .).

    Returns:
        Chuỗi ngày định dạng DD/MM/YYYY.
    """
    # Thay thế dấu - hoặc . bằng /
    normalized = re.sub(r'[-.]', '/', date_str)
    parts = normalized.split('/')
    if len(parts) == 3:
        day = parts[0].zfill(2)
        month = parts[1].zfill(2)
        year = parts[2]
        return f"{day}/{month}/{year}"
    return date_str


def clean_text(text: str) -> str:
    """
    Làm sạch text: bỏ ký tự thừa, khoảng trắng dư.

    Args:
        text: Chuỗi text cần làm sạch.

    Returns:
        Chuỗi text đã làm sạch.
    """
    # Bỏ các ký tự đặc biệt không hợp lệ nhưng giữ tiếng Việt
    cleaned = re.sub(r'[|\\@#\[\]{}]', '', text)
    # Chuẩn hóa khoảng trắng
    cleaned = re.sub(r'\s+', ' ', cleaned).strip()
    return cleaned


def is_noise_line(line: str) -> bool:
    """
    Kiểm tra xem một dòng có phải là "nhiễu" không
    (header quốc huy, tiêu đề card, v.v.).

    Args:
        line: Dòng text cần kiểm tra.

    Returns:
        True nếu là dòng nhiễu.
    """
    line_upper = line.upper()
    return any(noise in line_upper for noise in NOISE_WORDS_NAME)
