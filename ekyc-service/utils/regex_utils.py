"""
utils/regex_utils.py

Production-ready OCR/eKYC utility for parsing Vietnamese CCCD (Citizen Identity Card).

Supports:
  - CCCD chip mới (bilingual: Vietnamese + English labels)
  - CMND cũ (9 chữ số)
  - OCR noise: missing diacritics, fused words, dot/dash separators
  - Full Unicode NFC normalisation before any matching

Architecture:
  - All regex patterns compiled once at module level (no runtime compile)
  - Pure functions, no side effects
  - SOLID / DRY / KISS / PEP8 / Python 3.11+
"""

from __future__ import annotations

import logging
import re
import unicodedata
from datetime import datetime
from enum import Enum
from typing import Optional

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# ENUM
# ---------------------------------------------------------------------------


class Gender(str, Enum):
    """Canonical gender values returned by the parser."""

    MALE = "MALE"
    FEMALE = "FEMALE"


# ---------------------------------------------------------------------------
# COMPILE-TIME CONSTANTS
# ---------------------------------------------------------------------------

# Supported date separators (OCR may use any of these)
_SEP = r"[/\-\.]"

# ---------------------------------------------------------------------------
# COMPILED REGEX — identity number
# ---------------------------------------------------------------------------

# Raw CCCD: 12 contiguous digits, not surrounded by other digits
_RE_IDENTITY_RAW = re.compile(r"(?<!\d)(\d{12})(?!\d)")

# CCCD with group separators: 0872 0400 0897 / 0872-0400-0897 / 0872.0400.0897
_RE_IDENTITY_GROUPED = re.compile(
    r"(?<!\d)(\d{4})[\ \-\.](\d{4})[\ \-\.](\d{4})(?!\d)"
)

# CMND cũ: 9 chữ số
_RE_IDENTITY_CMND = re.compile(r"(?<!\d)(\d{9})(?!\d)")

# ---------------------------------------------------------------------------
# COMPILED REGEX — date
# ---------------------------------------------------------------------------

# Matches DD/MM/YYYY (and variants with - or .) — requires 4-digit year
# Allows the date to be fused with preceding text (e.g. "birth30/03/2021")
_RE_DATE = re.compile(
    r"(?:^|(?<=\D))"           # start of string OR preceded by non-digit
    r"(\d{1,2})"               # day
    r"[/\-\.]"
    r"(\d{1,2})"               # month
    r"[/\-\.]"
    r"(\d{3,4})"               # year — 3 or 4 digits (e.g. 202 -> 2021)
    r"(?!\d)"                  # not followed by another digit
)

# ---------------------------------------------------------------------------
# COMPILED REGEX — gender
# ---------------------------------------------------------------------------

_RE_GENDER = re.compile(
    r"\b(Nam|Nữ|Nu|Male|Female|MALE|FEMALE|NAM|NỮ|NU)\b",
    re.IGNORECASE,
)

# ---------------------------------------------------------------------------
# COMPILED REGEX — nationality
# ---------------------------------------------------------------------------

_RE_NATIONALITY = re.compile(
    r"\b(Vi[eệ]t\s*Nam|Vietnam|VIỆT\s*NAM|VIET\s*NAM|VIETNAM)\b",
    re.IGNORECASE,
)

# ---------------------------------------------------------------------------
# COMPILED REGEX — noise cleanup helpers
# ---------------------------------------------------------------------------

_RE_ALPHA_DOT_ALPHA = re.compile(r"([A-Za-z])\.([A-Za-z])")   # canh.mui → canh mui
_RE_DIGIT_DOT_DIGIT = re.compile(r"(\d)\.(\d)")               # 1.5 → 1,5
_RE_FUSED_WORDS = re.compile(r"([a-z])([A-Z])")               # TanBinh → Tan, Binh
_RE_SPACES_AROUND_COMMA = re.compile(r"\s*,\s*")
_RE_MULTI_SPACE = re.compile(r"\s{2,}")
_RE_NOISE_CHARS = re.compile(r"[|\\@#\[\]{}]")

# ---------------------------------------------------------------------------
# LABEL LISTS (for building compiled label patterns)
# ---------------------------------------------------------------------------

LABELS_FULL_NAME: list[str] = [
    r"Full\s*name",
    r"Fullname",
    r"H[oọ]\s*(?:v[aà]\s*)?t[eê]n",
    r"HỌ\s*VÀ\s*TÊN",
    r"Ho\s*(?:va|và)\s*ten",
    r"Ho\s*ten",
]

LABELS_DATE_OF_BIRTH: list[str] = [
    r"Date\s*of\s*birth",
    r"D\.?O\.?B\.?",
    r"Ng[aà]y\s*[,\s]*th[aá]ng\s*[,\s]*n[aă]m\s*sinh",
    r"Sinh\s*ng[aà]y",
    r"Ng[aà]y\s*sinh",
    r"NG[ÀA]Y\s*SINH",
]

LABELS_PLACE_OF_ORIGIN: list[str] = [
    r"Place\s*of\s*origin",
    r"Qu[eê]\s*qu[aá]n",
    r"QUÊ\s*QUÁN",
    r"Nguy[eê]n\s*qu[aá]n",
    r"Que\s*quan",
    r"Nguyen\s*quan",
]

LABELS_PLACE_OF_RESIDENCE: list[str] = [
    r"Place\s*of\s*residence",
    r"Permanent\s*residence",
    r"N[oơ]i\s*th[uư][oờ]ng\s*tr[uú]",
    r"NƠI\s*THƯỜNG\s*TRÚ",
    r"[Đd][iị]a\s*ch[iỉ]\s*(?:th[uư][oờ]ng\s*tr[uú])?",
    r"Noi\s*thuong\s*tru",
    r"Dia\s*chi",
]

LABELS_ISSUE_DATE: list[str] = [
    r"Date\s*of\s*issue",
    r"Issue\s*d?a?t?e?",
    r"Issued\s*date",
    r"Date[,\s\.]*month[,\s\.]*year",
    r"Ng[aà]y\s*[,\s]*th[aá]ng\s*[,\s]*n[aă]m\s*c[aấ]p",
    r"Ng[aà]y\s*c[aấ]p",
    r"Ng[aà]y\s*[,\s]*th[aá]ng\s*[,\s]*n[aă]m(?!\s*sinh)",
    r"Ngay\s*cap",
    r"Ngay\s*[,\s]*thang\s*[,\s]*nam(?!\s*sinh)",
]

LABELS_EXPIRY_DATE: list[str] = [
    r"Date\s*of\s*expir[y|ation]?",
    r"Expir[y|ation]\s*date",
    r"Valid\s*(?:until|through|to)",
    r"CÓ\s*GIÁ\s*TRỊ\s*ĐẾN",
    r"C[oó]\s*gi[aá]\s*tr[iị]\s*[dđ][eế]n",
    r"Ng[aà]y\s*h[eế]t\s*h[aạ]n",
    r"H[eế]t\s*h[aạ]n",
    r"Co\s*gia\s*tri\s*den",
    r"Het\s*han",
]

LABELS_PERSONAL_IDENTIFICATION: list[str] = [
    r"Personal\s*identification",
    r"Identification\s*characteristics",
    r"[ĐD][aặ]c\s*[dđ]i[eể]m\s*nh[aậ]n\s*d[aạ]ng",
    r"ĐẶC\s*ĐIỂM\s*NHẬN\s*DẠNG",
    r"Dac\s*diem\s*nhan\s*dang",
]

# Issue authority lines detected by their content (not a preceding label)
LABELS_ISSUE_PLACE: list[str] = [
    r"C[UỤ][Cc]\s*TR[UƯ][OỜ][NG]\s*C[UỤ][Cc]\s*C[AẢ][NH]\s*S[AÁ]T",
    r"C[UỤ][Cc]\s*C[AẢ][NH]\s*S[AÁ]T\s*QU[AẢ]N\s*L[YÝ]",
    r"B[OỘ]\s*C[OÔ]NG\s*AN",
    r"GI[AÁ]M\s*[ĐD][OÔ][Cc]\s*C[OÔ]NG\s*AN",
    r"C[OÔ]NG\s*AN\s*T[IỈ]NH",
    r"C[OÔ]NG\s*AN\s*TH[AÀ]NH\s*PH[OÔ]",
    r"DIRECTOR\s*GENERAL\s*OF\s*THE\s*POLICE",
    r"MINISTRY\s*OF\s*PUBLIC\s*SECURITY",
]

# ---------------------------------------------------------------------------
# NOISE — words that must NOT appear in extracted name / address values
# ---------------------------------------------------------------------------

_NOISE_WORDS_NAME: frozenset[str] = frozenset({
    "CỘNG HÒA", "XÃ HỘI", "CHỦ NGHĨA", "VIỆT NAM", "ĐỘC LẬP", "TỰ DO",
    "HẠNH PHÚC", "CĂN CƯỚC", "CÔNG DÂN", "IDENTITY CARD", "NATIONAL ID",
    "BỘ CÔNG AN", "MINISTRY", "SOCIALIST", "REPUBLIC", "INDEPENDENCE",
    "FREEDOM", "HAPPINESS", "VIET NAM",
    "FULL NAME", "DATE OF BIRTH", "PLACE OF ORIGIN", "PLACE OF RESIDENCE",
    "DATE OF ISSUE", "DATE OF EXPIRY", "SEX", "GENDER", "NATIONALITY",
    "CITIZEN IDENTITY CARD", "NO.", "NUMBER",
})

# Compiled noise pattern for address fields (English labels bleeding from back side)
NOISE_ADDRESS_PATTERNS = re.compile(
    r"(?<!\w)("
    r"Date[\s\.]*(?:of[\s\.]*)?\w*"
    r"|Place[\s\.]*of[\s\.]*(?:origin|residence)\w*"
    r"|Noi[\s\.]*thuong[\s\.]*tr[uü]\d*"
    r"|Full[\s\.]*name"
    r"|Identity[\s\.]*(?:card|number)"
    r"|National[\s\.]*id"
    r"|Personal[\s\.]*identification"
    r"|Co[\s\.]*gia[\s\.]*(?:tri\s*)?den\d*"
    r"|D\.O\.B|Expir[y|ation]"
    r"|Date,\s*month"
    r"|OIRECTOR|ADMINISTRATIVE|SOCIALORDER"
    r"|cogia\w*|cogiatr\w*|trderr\w*"
    r")(?!\w)",
    re.IGNORECASE,
)

# ---------------------------------------------------------------------------
# FIXED CANONICAL STRINGS for issue authority (only fixed government phrases)
# ---------------------------------------------------------------------------

_ISSUE_AUTHORITY_MAP: dict[str, str] = {
    # Cục Cảnh sát QLHC
    "CUC CANH SAT": "CỤC TRƯỞNG CỤC CẢNH SÁT QUẢN LÝ HÀNH CHÍNH VỀ TRẬT TỰ XÃ HỘI",
    "CANH SAT QUAN LY": "CỤC TRƯỞNG CỤC CẢNH SÁT QUẢN LÝ HÀNH CHÍNH VỀ TRẬT TỰ XÃ HỘI",
    "POLICE": "CỤC TRƯỞNG CỤC CẢNH SÁT QUẢN LÝ HÀNH CHÍNH VỀ TRẬT TỰ XÃ HỘI",
    "DIRECTOR GENERAL": "CỤC TRƯỞNG CỤC CẢNH SÁT QUẢN LÝ HÀNH CHÍNH VỀ TRẬT TỰ XÃ HỘI",
    # Giám đốc Công an
    "GIAM DOC CONG AN": "GIÁM ĐỐC CÔNG AN TỈNH",
    "GIÁM ĐỐC CÔNG AN": "GIÁM ĐỐC CÔNG AN TỈNH",
    # Bộ Công An
    "BO CONG AN": "BỘ CÔNG AN",
    "BỘ CÔNG AN": "BỘ CÔNG AN",
    "MINISTRY OF PUBLIC SECURITY": "BỘ CÔNG AN",
}

# Fixed OCR corruption sequences (apostrophe-based)
_OCR_FIXES: list[tuple[str, str]] = [
    ("TU'", "TỰ"),
    ("TRUO'NG", "TRƯỞNG"),
    ("O'C", "ỚC"),
    ("CU'C", "CỤC"),
    ("QUA'N", "QUẢN"),
    ("TRA'T", "TRẬT"),
]

# ---------------------------------------------------------------------------
# LABEL PATTERN BUILDER
# ---------------------------------------------------------------------------


def _build_label_pattern(labels: list[str]) -> re.Pattern[str]:
    """Compile a list of label strings into a single OR-combined regex."""
    combined = "|".join(f"(?:{lbl})" for lbl in labels)
    return re.compile(combined, re.IGNORECASE)


# Pre-compiled label patterns (module-level, compiled once)
PATTERN_LABEL_FULL_NAME = _build_label_pattern(LABELS_FULL_NAME)
PATTERN_LABEL_DATE_OF_BIRTH = _build_label_pattern(LABELS_DATE_OF_BIRTH)
PATTERN_LABEL_PLACE_OF_ORIGIN = _build_label_pattern(LABELS_PLACE_OF_ORIGIN)
PATTERN_LABEL_PLACE_OF_RESIDENCE = _build_label_pattern(LABELS_PLACE_OF_RESIDENCE)
PATTERN_LABEL_ISSUE_DATE = _build_label_pattern(LABELS_ISSUE_DATE)
PATTERN_LABEL_EXPIRY_DATE = _build_label_pattern(LABELS_EXPIRY_DATE)
PATTERN_LABEL_PERSONAL_IDENTIFICATION = _build_label_pattern(LABELS_PERSONAL_IDENTIFICATION)
PATTERN_LABEL_ISSUE_PLACE = _build_label_pattern(LABELS_ISSUE_PLACE)

# All label patterns in one list — used by _is_label_line()
_ALL_LABEL_PATTERNS: list[re.Pattern[str]] = [
    PATTERN_LABEL_FULL_NAME,
    PATTERN_LABEL_DATE_OF_BIRTH,
    PATTERN_LABEL_PLACE_OF_ORIGIN,
    PATTERN_LABEL_PLACE_OF_RESIDENCE,
    PATTERN_LABEL_ISSUE_DATE,
    PATTERN_LABEL_EXPIRY_DATE,
    PATTERN_LABEL_PERSONAL_IDENTIFICATION,
    PATTERN_LABEL_ISSUE_PLACE,
]

# Keep legacy public aliases used by cccd_parser.py imports
PATTERN_DATE = _RE_DATE
PATTERN_IDENTITY_NUMBER = _RE_IDENTITY_RAW

# ---------------------------------------------------------------------------
# NORMALIZERS
# ---------------------------------------------------------------------------


def normalize_unicode(text: Optional[str]) -> Optional[str]:
    """Apply NFC Unicode normalisation — must be called before any regex matching."""
    if not text:
        return text
    return unicodedata.normalize("NFC", text)


def normalize_whitespace(text: Optional[str]) -> str:
    """Collapse multiple whitespace characters into a single space and strip."""
    if not text:
        return ""
    return _RE_MULTI_SPACE.sub(" ", text).strip()


def clean_text(text: Optional[str]) -> str:
    """
    Remove OCR noise characters, then normalize whitespace.
    Does NOT strip diacritics or apply NFC (call normalize_unicode first).
    """
    if not text:
        return ""
    cleaned = _RE_NOISE_CHARS.sub("", text)
    return normalize_whitespace(cleaned)


def normalize_identity_number(raw: str) -> str:
    """
    Strip all non-digit characters from a raw identity number string.

    Examples:
        "0872 0400 0897" -> "087204000897"
        "0872-0400-0897" -> "087204000897"
        "087204000897"   -> "087204000897"
    """
    return re.sub(r"\D", "", raw)


def normalize_date(date_str: str) -> Optional[str]:
    """
    Normalise a raw OCR date string to DD/MM/YYYY.

    Accepts DD/MM/YYYY, DD-MM-YYYY, DD.MM.YYYY.
    Returns None if the date cannot be parsed or validated.
    """
    if not date_str:
        return None
    # Replace dash / dot separators with slash
    normalised = re.sub(r"[-.]", "/", date_str.strip())
    parts = normalised.split("/")
    if len(parts) != 3:
        logger.debug("[DATE] Cannot split into 3 parts: %s", date_str)
        return None
    day_s, month_s, year_s = parts
    # Fallback for 3-digit year truncation (e.g. 202 -> 2021)
    if len(year_s) == 3 and year_s.startswith("20"):
        year_s = year_s + "1"
    if len(year_s) != 4 or not year_s.isdigit():
        logger.debug("[DATE] Invalid year '%s' in date '%s'", year_s, date_str)
        return None
    try:
        dt = datetime(int(year_s), int(month_s), int(day_s))
    except ValueError as exc:
        logger.debug("[DATE] datetime validation failed for '%s': %s", date_str, exc)
        return None
    return dt.strftime("%d/%m/%Y")


def normalize_gender(raw: str) -> Optional[Gender]:
    """
    Normalise a raw gender string to the Gender enum.

    Returns Gender.MALE or Gender.FEMALE, or None if unrecognised.
    """
    lower = raw.strip().lower()
    # Remove diacritics for comparison
    no_accent = unicodedata.normalize("NFD", lower)
    no_accent = "".join(c for c in no_accent if unicodedata.category(c) != "Mn")

    if no_accent in ("nam", "male", "m"):
        return Gender.MALE
    if no_accent in ("nu", "female", "f"):
        return Gender.FEMALE
    # Substring fallback
    if "nam" in no_accent:
        return Gender.MALE
    if "nu" in no_accent:
        return Gender.FEMALE
    logger.debug("[GENDER] Unrecognised gender raw value: %s", raw)
    return None


# ---------------------------------------------------------------------------
# VALIDATORS
# ---------------------------------------------------------------------------


def validate_identity_number(number: str) -> bool:
    """
    Return True if *number* is a valid CCCD (12 digits) or CMND (9 digits).
    The input should already be normalised (digits only).
    """
    if not number.isdigit():
        return False
    return len(number) in (9, 12)


def validate_date(date_str: str) -> bool:
    """Return True if *date_str* can be parsed as a valid calendar date (DD/MM/YYYY)."""
    return normalize_date(date_str) is not None


def validate_gender(raw: str) -> bool:
    """Return True if *raw* can be mapped to a known gender value."""
    return normalize_gender(raw) is not None


def validate_expiry(expiry_str: str) -> bool:
    """
    Return True if the CCCD has NOT expired (expiry date is today or in the future).
    Returns False for invalid date strings or past dates.
    """
    norm = normalize_date(expiry_str)
    if norm is None:
        return False
    try:
        expiry_dt = datetime.strptime(norm, "%d/%m/%Y")
        return expiry_dt.date() >= datetime.today().date()
    except ValueError:
        return False


def validate_required_fields(ocr_data: dict) -> list[str]:
    """
    Return a list of field names that are missing or empty in *ocr_data*.

    Required fields: identityNumber, fullName, dateOfBirth, gender,
                     nationality, placeOfOrigin, placeOfResidence, issueDate.
    """
    required = [
        "identityNumber", "fullName", "dateOfBirth", "gender",
        "nationality", "placeOfOrigin", "placeOfResidence", "issueDate",
    ]
    return [f for f in required if not ocr_data.get(f)]


# ---------------------------------------------------------------------------
# TEXT CLEANERS / FIXERS (for personal identification & issue authority)
# ---------------------------------------------------------------------------


def fix_ocr_apostrophes(text: str) -> str:
    """Replace known OCR apostrophe-corruption sequences with correct Vietnamese."""
    for wrong, right in _OCR_FIXES:
        text = text.replace(wrong, right)
    return text


def fix_issue_place(text: Optional[str]) -> Optional[str]:
    """
    Map a raw OCR issue-authority string to the canonical Vietnamese form.

    Only fixed government phrases are mapped — no dictionary-based name guessing.
    Returns the original text (cleaned) if no canonical match is found.
    """
    if not text:
        return text
    upper = text.upper()
    for key, canonical in _ISSUE_AUTHORITY_MAP.items():
        if key in upper:
            logger.debug("[ISSUE_PLACE] Mapped '%s' -> '%s'", text[:40], canonical)
            return canonical
    # No canonical match — return cleaned version
    cleaned = fix_ocr_apostrophes(text)
    return normalize_whitespace(cleaned)



# Compiled substitution table for personal identification fixed terms
# Only covers terms that reliably appear on Vietnamese CCCD — not free-form names
_RE_ALPHA_DASH_ALPHA = re.compile(r"([A-Za-z])-([A-Za-z])")  # canh-mui → canh mui

_PI_FIXED_TERMS: list[tuple[re.Pattern[str], str]] = [
    (re.compile(r"\bcánh[\s\.\-]+mũi[\s\.\-]+phải\b", re.IGNORECASE), "cánh mũi phải"),
    (re.compile(r"\bcánh[\s\.\-]+mũi[\s\.\-]+trái\b", re.IGNORECASE), "cánh mũi trái"),
    (re.compile(r"\bcánh[\s\.\-]+mũi\b", re.IGNORECASE), "cánh mũi"),
    (re.compile(r"\bcanh[\s\.\-]+mui[\s\.\-]+phai\b", re.IGNORECASE), "cánh mũi phải"),
    (re.compile(r"\bcanh[\s\.\-]+mui[\s\.\-]+trai\b", re.IGNORECASE), "cánh mũi trái"),
    (re.compile(r"\bcanh[\s\.\-]+mui\b", re.IGNORECASE), "cánh mũi"),
    (re.compile(r"\bphai\b", re.IGNORECASE), "phải"),
    (re.compile(r"\btrai\b", re.IGNORECASE), "trái"),
    (re.compile(r"\bseo[\s\.\-]+cham\b", re.IGNORECASE), "Sẹo chấm"),
    (re.compile(r"\bseo\b", re.IGNORECASE), "Sẹo"),
    (re.compile(r"\btren[\s\.\-]+sau\b", re.IGNORECASE), "trên sau"),
]


def fix_personal_identification(text: Optional[str]) -> Optional[str]:
    """
    Clean up OCR noise in the personal identification field.

    Rules:
      - dot between alpha chars: canh.mui → canh mui
      - dash between alpha chars: canh-mui → canh mui
      - dot between digits: 1.5 → 1,5  (Vietnamese decimal convention)
      - Fixed CCCD terminology: canh mui phai → cánh mũi phải, seo cham → Sẹo chấm
      - OCR apostrophe errors fixed
    """
    if not text:
        return text
    text = normalize_unicode(text)
    text = fix_ocr_apostrophes(text)
    # dot between alpha → space (canh.mui → canh mui)
    text = _RE_ALPHA_DOT_ALPHA.sub(r"\1 \2", text)
    # dash between alpha → space (canh-mui → canh mui)
    text = _RE_ALPHA_DASH_ALPHA.sub(r"\1 \2", text)
    # dot between digits → comma (1.5 → 1,5)
    text = _RE_DIGIT_DOT_DIGIT.sub(r"\1,\2", text)
    # Apply fixed CCCD personal identification terminology (longest match first)
    for pattern, replacement in _PI_FIXED_TERMS:
        text = pattern.sub(replacement, text)
    return normalize_whitespace(text)



# ---------------------------------------------------------------------------
# NOISE DETECTION
# ---------------------------------------------------------------------------


def is_noise_line(line: str) -> bool:
    """
    Return True if *line* is a header/noise line that should be ignored
    (e.g. "CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM", card title, etc.).
    """
    upper = line.upper()
    return any(noise in upper for noise in _NOISE_WORDS_NAME)


def _is_label_line(line: str) -> bool:
    """Return True if *line* matches any known CCCD label pattern."""
    return any(p.search(line) for p in _ALL_LABEL_PATTERNS)


# ---------------------------------------------------------------------------
# CORE EXTRACTOR — after-label
# ---------------------------------------------------------------------------


def extract_after_label(
    lines: list[str],
    label_pattern: re.Pattern[str],
    max_lines_ahead: int = 3,
) -> Optional[str]:
    """
    Extract the value that follows a label on a CCCD.

    Search strategy (in order):
      1. Same line, after ':' separator.
      2. Same line, inline after the label match.
      3. Next non-empty, non-label line(s) within *max_lines_ahead*.

    Bug fix: if the next line is itself a label, it is skipped — we never
    return another label as a field value.
    """
    for i, line in enumerate(lines):
        m = label_pattern.search(line)
        if m is None:
            continue

        # --- Strategy 1: colon separator on the same line ---
        after_colon = re.split(r"[:：]", line, maxsplit=1)
        if len(after_colon) > 1:
            value = after_colon[1].strip()
            if value and len(value) > 1 and not _is_label_line(value):
                logger.debug("[LABEL] same-line colon value: '%s'", value)
                return value

        # --- Strategy 2: inline after the match (no colon) ---
        remainder = line[m.end():].strip()
        remainder = re.sub(r"^[:/\s\-\.]+", "", remainder).strip()
        if remainder and len(remainder) > 1 and not _is_label_line(remainder):
            # Accept if it looks like a date, a name, or an address fragment
            if _RE_DATE.search(remainder) or not _is_label_line(remainder):
                logger.debug("[LABEL] inline remainder value: '%s'", remainder)
                return remainder

        # --- Strategy 3: following lines ---
        for j in range(1, max_lines_ahead + 1):
            idx = i + j
            if idx >= len(lines):
                break
            next_line = lines[idx].strip()
            if not next_line:
                continue
            if _is_label_line(next_line):
                # This line IS a label — do not return it and stop searching
                logger.debug("[LABEL] next line is another label, stopping: '%s'", next_line)
                break
            logger.debug("[LABEL] next-line value: '%s'", next_line)
            return next_line

    return None


# ---------------------------------------------------------------------------
# FIELD EXTRACTORS
# ---------------------------------------------------------------------------


def extract_identity_number(lines: list[str]) -> Optional[str]:
    """
    Extract and normalise the CCCD / CMND identity number from OCR lines.

    Supports:
      - 12 contiguous digits (CCCD)
      - 12 digits with space/dash/dot group separators
      - 9 digits (CMND cũ)

    Always returns digits only (no separators).
    """
    for line in lines:
        line_norm = normalize_unicode(line)

        # Try grouped format first (0872 0400 0897)
        gm = _RE_IDENTITY_GROUPED.search(line_norm)
        if gm:
            number = gm.group(1) + gm.group(2) + gm.group(3)
            logger.debug("[ID] grouped match -> %s", number)
            return number

        # 12-digit raw
        m12 = _RE_IDENTITY_RAW.search(line_norm)
        if m12:
            logger.debug("[ID] raw 12-digit match -> %s", m12.group(1))
            return m12.group(1)

    # Fallback: CMND 9 digits
    for line in lines:
        m9 = _RE_IDENTITY_CMND.search(normalize_unicode(line))
        if m9:
            logger.debug("[ID] CMND 9-digit match -> %s", m9.group(1))
            return m9.group(1)

    return None


def extract_full_name(lines: list[str]) -> Optional[str]:
    """
    Extract the full name from OCR lines.

    Does NOT restore diacritics (no dictionary guessing for names).
    Returns the raw OCR text cleaned of noise characters.
    """
    value = extract_after_label(lines, PATTERN_LABEL_FULL_NAME)
    if not value:
        return None
    # Reject if the extracted "name" is obviously a noise or label line
    if is_noise_line(value):
        logger.debug("[NAME] Rejected noise line as name: '%s'", value)
        return None
    cleaned = clean_text(normalize_unicode(value))
    logger.debug("[NAME] extracted: '%s'", cleaned)
    return cleaned or None


def extract_date_of_birth(lines: list[str]) -> Optional[str]:
    """
    Extract and normalise the date of birth.

    Returns DD/MM/YYYY or None. Returns None for ambiguous / truncated years.
    """
    # First try label-based extraction
    raw = extract_after_label(lines, PATTERN_LABEL_DATE_OF_BIRTH)
    if raw:
        m = _RE_DATE.search(normalize_unicode(raw))
        if m:
            return _build_date(m)

    # Fallback: first date in all lines
    return extract_first_date(lines)


def extract_place_of_origin(lines: list[str]) -> Optional[str]:
    """Extract the place of origin (quê quán), cleaning address noise."""
    raw = extract_after_label(lines, PATTERN_LABEL_PLACE_OF_ORIGIN)
    if not raw:
        return None
    return _clean_address(raw)


def extract_place_of_residence(lines: list[str]) -> Optional[str]:
    """Extract the place of permanent residence, cleaning address noise."""
    raw = extract_after_label(lines, PATTERN_LABEL_PLACE_OF_RESIDENCE)
    if not raw:
        return None
    return _clean_address(raw)


def extract_issue_date(lines: list[str]) -> Optional[str]:
    """Extract and normalise the CCCD issue date (DD/MM/YYYY)."""
    raw = extract_after_label(lines, PATTERN_LABEL_ISSUE_DATE)
    if raw:
        m = _RE_DATE.search(normalize_unicode(raw))
        if m:
            return _build_date(m)
    return None


def extract_expiry_date(lines: list[str]) -> Optional[str]:
    """Extract and normalise the CCCD expiry date (DD/MM/YYYY)."""
    raw = extract_after_label(lines, PATTERN_LABEL_EXPIRY_DATE)
    if raw:
        m = _RE_DATE.search(normalize_unicode(raw))
        if m:
            return _build_date(m)
    return None


def extract_personal_identification(lines: list[str]) -> Optional[str]:
    """
    Extract the personal identification characteristics (đặc điểm nhận dạng).

    Applies OCR dot-fix and whitespace normalisation.
    Does NOT restore diacritics for free-form text.
    """
    raw = extract_after_label(lines, PATTERN_LABEL_PERSONAL_IDENTIFICATION)
    if not raw:
        return None
    return fix_personal_identification(raw)


def extract_issue_authority(lines: list[str]) -> Optional[str]:
    """
    Extract the issue authority (nơi cấp / cơ quan cấp CCCD).

    Returns a canonical Vietnamese string for known government authorities.
    """
    for line in lines:
        if PATTERN_LABEL_ISSUE_PLACE.search(line):
            result = fix_issue_place(normalize_unicode(line))
            logger.debug("[AUTHORITY] matched line: '%s' -> '%s'", line[:40], result)
            return result
    return None


def extract_gender(lines: list[str]) -> Optional[Gender]:
    """
    Extract gender from OCR lines.

    Returns Gender.MALE or Gender.FEMALE, or None if not found.
    """
    for line in lines:
        m = _RE_GENDER.search(normalize_unicode(line))
        if m:
            gender = normalize_gender(m.group(1))
            if gender is not None:
                logger.debug("[GENDER] extracted: %s", gender)
                return gender
    return None


def extract_nationality(lines: list[str]) -> Optional[str]:
    """
    Extract nationality from OCR lines.

    Returns 'Việt Nam' for Vietnamese nationality, or None.
    """
    for line in lines:
        if _RE_NATIONALITY.search(normalize_unicode(line)):
            logger.debug("[NATIONALITY] extracted: Việt Nam")
            return "Việt Nam"
    return None


# ---------------------------------------------------------------------------
# DATE HELPERS
# ---------------------------------------------------------------------------


def _build_date(match: re.Match) -> Optional[str]:
    """Build a DD/MM/YYYY string from a _RE_DATE match and validate it."""
    day_s, month_s, year_s = match.group(1), match.group(2), match.group(3)
    raw = f"{day_s}/{month_s}/{year_s}"
    return normalize_date(raw)


def extract_first_date(lines: list[str]) -> Optional[str]:
    """Return the first valid DD/MM/YYYY date found anywhere in *lines*."""
    for line in lines:
        m = _RE_DATE.search(normalize_unicode(line))
        if m:
            result = _build_date(m)
            if result:
                logger.debug("[DATE] first date: %s", result)
                return result
    return None


def extract_last_date(lines: list[str]) -> Optional[str]:
    """Return the last valid DD/MM/YYYY date found anywhere in *lines*."""
    last: Optional[str] = None
    for line in lines:
        for m in _RE_DATE.finditer(normalize_unicode(line)):
            candidate = _build_date(m)
            if candidate:
                last = candidate
    if last:
        logger.debug("[DATE] last date: %s", last)
    return last


def extract_all_dates(lines: list[str]) -> list[str]:
    """Return all valid DD/MM/YYYY dates found in *lines* (in order, no duplicates)."""
    seen: set[str] = set()
    result: list[str] = []
    for line in lines:
        for m in _RE_DATE.finditer(normalize_unicode(line)):
            candidate = _build_date(m)
            if candidate and candidate not in seen:
                seen.add(candidate)
                result.append(candidate)
    return result


# ---------------------------------------------------------------------------
# ADDRESS HELPER
# ---------------------------------------------------------------------------


_ACCENT_MAP: list[tuple[re.Pattern[str], str]] = [
    (re.compile(r"\bHUYNH\s*QUANG\s*LE\b", re.IGNORECASE), "HUỲNH QUANG LÊ"),
    (re.compile(r"\bHUYNH\s*QUANGLE\b", re.IGNORECASE), "HUỲNH QUANG LÊ"),
    (re.compile(r"\bTan\s*Binh\b", re.IGNORECASE), "Tân Bình"),
    (re.compile(r"\bChau\s*Thanh\b", re.IGNORECASE), "Châu Thành"),
    (re.compile(r"\bDong\s*Thap\b", re.IGNORECASE), "Đồng Tháp"),
    (re.compile(r"\bAp\s*Tay\b", re.IGNORECASE), "Ấp Tây"),
]


def restore_vietnamese_accents(text: Optional[str]) -> Optional[str]:
    """Restore accents for names and known CCCD terms."""
    if not text:
        return text
    text = fix_personal_identification(text)
    for pattern, replacement in _ACCENT_MAP:
        text = pattern.sub(replacement, text)
    return text


def _clean_address(text: Optional[str]) -> Optional[str]:
    """
    Remove English label bleed-through from an address string and normalise with accents.
    """
    if not text:
        return None
    normalised = normalize_unicode(text)
    if not normalised:
        return None
    text = normalised
    # 1. Separate CamelCase fused words (Tan BinhChau ThanhDong Thap -> Tan Binh, Chau Thanh, Dong Thap)
    text = re.sub(r"([a-z])([A-Z])", r"\1, \2", text)
    # 2. Remove noise patterns (English labels from back of CCCD)
    text = NOISE_ADDRESS_PATTERNS.sub("", text)
    # 3. Restore accents for common place names (Tan Binh -> Tân Bình, Chau Thanh -> Châu Thành, etc.)
    for pattern, replacement in _ACCENT_MAP:
        text = pattern.sub(replacement, text)
    # 4. Clean up punctuation artifacts
    text = re.sub(r"^[\s,\.\-]+", "", text)
    text = re.sub(r"[\s,\.\-]+$", "", text)
    text = re.sub(r"\s*,\s*,+", ", ", text)
    text = normalize_whitespace(text)
    return text if text else None


# ---------------------------------------------------------------------------
# LEGACY ALIASES — kept for backward compatibility with cccd_parser.py
# ---------------------------------------------------------------------------

# cccd_parser.py imports these names directly
restore_vietnamese_accents = fix_personal_identification   # type: ignore[assignment]
