"""
parsers/cccd_parser.py

Parser trích xuất và chuẩn hóa thông tin từ danh sách text OCR của CCCD Việt Nam.

Áp dụng Single Responsibility Principle:
- Chỉ chịu trách nhiệm parse text → OcrResult
- Không gọi OCR, không xử lý ảnh
"""

import logging
from typing import Optional

from models.ocr_response import OcrResult
from utils.regex_utils import (
    PATTERN_LABEL_DATE_OF_BIRTH,
    PATTERN_LABEL_FULL_NAME,
    PATTERN_LABEL_ISSUE_DATE,
    PATTERN_LABEL_PLACE_OF_ORIGIN,
    PATTERN_LABEL_PLACE_OF_RESIDENCE,
    clean_text,
    extract_after_label,
    extract_all_dates,
    extract_first_date,
    extract_gender,
    extract_identity_number,
    extract_nationality,
    is_noise_line,
    normalize_date,
    PATTERN_DATE,
)

logger = logging.getLogger(__name__)


class CCCDParser:
    """
    Parser CCCD Việt Nam theo Clean Architecture.

    Nhận danh sách text dòng từ PaddleOCR, áp dụng
    chiến lược trích xuất từng trường dựa trên regex + context.
    """

    def parse(self, ocr_lines: list[str]) -> OcrResult:
        """
        Parse toàn bộ thông tin CCCD từ danh sách text dòng OCR.

        Args:
            ocr_lines: Danh sách các dòng text do PaddleOCR trả về.

        Returns:
            OcrResult chứa các trường đã trích xuất (có thể None nếu không tìm thấy).
        """
        logger.info(f"Bắt đầu parse CCCD từ {len(ocr_lines)} dòng OCR.")
        logger.debug(f"OCR Lines: {ocr_lines}")

        # Làm sạch danh sách dòng trước khi parse
        cleaned_lines = [clean_text(line) for line in ocr_lines if line.strip()]

        identity_number = self._extract_identity_number(cleaned_lines)
        full_name = self._extract_full_name(cleaned_lines)
        date_of_birth = self._extract_date_of_birth(cleaned_lines)
        gender = self._extract_gender(cleaned_lines)
        nationality = self._extract_nationality(cleaned_lines)
        place_of_origin = self._extract_place_of_origin(cleaned_lines)
        place_of_residence = self._extract_place_of_residence(cleaned_lines)
        issue_date = self._extract_issue_date(cleaned_lines)

        result = OcrResult(
            identityNumber=identity_number,
            fullName=full_name,
            dateOfBirth=date_of_birth,
            gender=gender,
            nationality=nationality,
            placeOfOrigin=place_of_origin,
            placeOfResidence=place_of_residence,
            issueDate=issue_date,
        )

        logger.info(f"Parse CCCD hoàn tất: {result.model_dump()}")
        return result

    # ------------------------------------------------------------------
    # PRIVATE EXTRACTION METHODS
    # ------------------------------------------------------------------

    def _extract_identity_number(self, lines: list[str]) -> Optional[str]:
        """Trích xuất số CCCD 12 chữ số."""
        number = extract_identity_number(lines)
        if number:
            logger.info(f"[CCCD] identityNumber: {number}")
        else:
            logger.warning("[CCCD] Không tìm thấy số CCCD.")
        return number

    def _extract_full_name(self, lines: list[str]) -> Optional[str]:
        """
        Trích xuất họ tên.

        Chiến lược:
        1. Tìm dòng sau label "Họ và tên" / "Full name"
        2. Lọc bỏ các dòng nhiễu (header, tiêu đề)
        3. Fallback: tìm dòng ALL CAPS không phải label, không phải số
        """
        # Chiến lược 1: Tìm sau label
        name = extract_after_label(lines, PATTERN_LABEL_FULL_NAME)
        if name and not is_noise_line(name):
            name = self._clean_name(name)
            logger.info(f"[CCCD] fullName (via label): {name}")
            return name

        # Chiến lược 2 (fallback): Tìm dòng ALL CAPS dài hợp lệ
        for line in lines:
            stripped = line.strip()
            if (
                stripped.isupper()
                and 3 <= len(stripped.split()) <= 6  # Họ tên thường 3-6 từ
                and not stripped.isdigit()
                and not is_noise_line(stripped)
                and not PATTERN_DATE.search(stripped)
                and not any(c.isdigit() for c in stripped)
            ):
                name = self._clean_name(stripped)
                logger.info(f"[CCCD] fullName (fallback ALL CAPS): {name}")
                return name

        logger.warning("[CCCD] Không tìm thấy fullName.")
        return None

    def _extract_date_of_birth(self, lines: list[str]) -> Optional[str]:
        """
        Trích xuất ngày sinh.

        Chiến lược:
        1. Tìm sau label "Ngày sinh" / "Date of birth"
        2. Fallback: lấy ngày đầu tiên tìm thấy trong toàn bộ text
        """
        # Chiến lược 1: Tìm sau label
        value = extract_after_label(lines, PATTERN_LABEL_DATE_OF_BIRTH)
        if value:
            date_match = PATTERN_DATE.search(value)
            if date_match:
                dob = normalize_date(date_match.group(1))
                logger.info(f"[CCCD] dateOfBirth (via label): {dob}")
                return dob

        # Chiến lược 2: Ngày đầu tiên trong text
        dob = extract_first_date(lines)
        if dob:
            logger.info(f"[CCCD] dateOfBirth (fallback first date): {dob}")
        else:
            logger.warning("[CCCD] Không tìm thấy dateOfBirth.")
        return dob

    def _extract_gender(self, lines: list[str]) -> Optional[str]:
        """Trích xuất giới tính."""
        gender = extract_gender(lines)
        if gender:
            logger.info(f"[CCCD] gender: {gender}")
        else:
            logger.warning("[CCCD] Không tìm thấy gender.")
        return gender

    def _extract_nationality(self, lines: list[str]) -> Optional[str]:
        """Trích xuất quốc tịch."""
        nationality = extract_nationality(lines)
        if nationality:
            logger.info(f"[CCCD] nationality: {nationality}")
        else:
            logger.warning("[CCCD] Không tìm thấy nationality.")
        return nationality

    def _extract_place_of_origin(self, lines: list[str]) -> Optional[str]:
        """Trích xuất quê quán."""
        value = extract_after_label(lines, PATTERN_LABEL_PLACE_OF_ORIGIN)
        if value:
            value = clean_text(value)
            logger.info(f"[CCCD] placeOfOrigin: {value}")
        else:
            logger.warning("[CCCD] Không tìm thấy placeOfOrigin.")
        return value

    def _extract_place_of_residence(self, lines: list[str]) -> Optional[str]:
        """
        Trích xuất nơi thường trú.

        Địa chỉ thường trú có thể nằm trên nhiều dòng OCR.
        Chiến lược: lấy dòng tiếp theo sau label,
        và ghép thêm dòng kế tiếp nếu dòng đó không phải label khác.
        """
        for i, line in enumerate(lines):
            if PATTERN_LABEL_PLACE_OF_RESIDENCE.search(line):
                # Lấy giá trị inline (sau dấu :)
                parts = line.split(':', 1)
                if len(parts) > 1 and parts[1].strip():
                    addr = parts[1].strip()
                    # Ghép dòng tiếp theo nếu có vẻ là tiếp nối địa chỉ
                    addr = self._try_concat_next_line(lines, i + 1, addr)
                    addr = clean_text(addr)
                    logger.info(f"[CCCD] placeOfResidence (inline): {addr}")
                    return addr

                # Lấy dòng tiếp theo
                for j in range(1, 4):
                    if i + j < len(lines):
                        next_line = lines[i + j].strip()
                        if next_line and not self._is_any_label(next_line):
                            addr = next_line
                            # Ghép dòng tiếp theo nếu cần
                            addr = self._try_concat_next_line(lines, i + j + 1, addr)
                            addr = clean_text(addr)
                            logger.info(f"[CCCD] placeOfResidence (next line): {addr}")
                            return addr

        logger.warning("[CCCD] Không tìm thấy placeOfResidence.")
        return None

    def _extract_issue_date(self, lines: list[str]) -> Optional[str]:
        """
        Trích xuất ngày cấp CCCD.

        Chiến lược:
        1. Tìm ngày sau label "Ngày cấp"
        2. Fallback: lấy ngày cuối cùng trong text (thường là ngày cấp)
        """
        # Chiến lược 1: Label
        value = extract_after_label(lines, PATTERN_LABEL_ISSUE_DATE)
        if value:
            date_match = PATTERN_DATE.search(value)
            if date_match:
                issue = normalize_date(date_match.group(1))
                logger.info(f"[CCCD] issueDate (via label): {issue}")
                return issue

        # Chiến lược 2: Ngày cuối cùng trong text
        all_dates = extract_all_dates(lines)
        if len(all_dates) >= 2:
            issue = all_dates[-1]
            logger.info(f"[CCCD] issueDate (fallback last date): {issue}")
            return issue

        logger.warning("[CCCD] Không tìm thấy issueDate.")
        return None

    # ------------------------------------------------------------------
    # PRIVATE HELPERS
    # ------------------------------------------------------------------

    @staticmethod
    def _clean_name(name: str) -> str:
        """
        Làm sạch chuỗi họ tên: bỏ ký tự không hợp lệ, title case.

        Args:
            name: Chuỗi họ tên thô.

        Returns:
            Họ tên đã làm sạch dạng UPPER CASE.
        """
        import re
        # Chỉ giữ lại chữ cái (Unicode) và khoảng trắng
        name = re.sub(r'[^\w\s]', '', name, flags=re.UNICODE)
        name = re.sub(r'\s+', ' ', name).strip().upper()
        return name

    @staticmethod
    def _try_concat_next_line(lines: list[str], idx: int, current: str) -> str:
        """
        Thử ghép dòng tiếp theo vào địa chỉ nếu có vẻ là tiếp nối.

        Args:
            lines: Tất cả các dòng OCR.
            idx: Chỉ số dòng tiếp theo cần xét.
            current: Chuỗi địa chỉ hiện tại.

        Returns:
            Chuỗi địa chỉ có thể đã ghép thêm.
        """
        if idx < len(lines):
            next_line = lines[idx].strip()
            # Dòng tiếp theo là tiếp nối nếu: ngắn (<100 ký tự),
            # không phải label, có chữ (không chỉ số)
            if (
                next_line
                and len(next_line) < 100
                and not CCCDParser._is_any_label_static(next_line)
                and not PATTERN_DATE.search(next_line)
            ):
                return current + ', ' + next_line
        return current

    @staticmethod
    def _is_any_label_static(line: str) -> bool:
        """Kiểm tra line có phải label không (static method)."""
        from utils.regex_utils import (
            PATTERN_LABEL_FULL_NAME,
            PATTERN_LABEL_DATE_OF_BIRTH,
            PATTERN_LABEL_PLACE_OF_ORIGIN,
            PATTERN_LABEL_PLACE_OF_RESIDENCE,
            PATTERN_LABEL_ISSUE_DATE,
        )
        patterns = [
            PATTERN_LABEL_FULL_NAME,
            PATTERN_LABEL_DATE_OF_BIRTH,
            PATTERN_LABEL_PLACE_OF_ORIGIN,
            PATTERN_LABEL_PLACE_OF_RESIDENCE,
            PATTERN_LABEL_ISSUE_DATE,
        ]
        return any(p.search(line) for p in patterns)

    def _is_any_label(self, line: str) -> bool:
        """Instance method wrapper."""
        return self._is_any_label_static(line)
