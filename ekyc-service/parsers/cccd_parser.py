"""
parsers/cccd_parser.py

Parser trích xuất và chuẩn hóa thông tin từ danh sách text OCR của CCCD Việt Nam.

Áp dụng Single Responsibility Principle:
- Chỉ chịu trách nhiệm parse text → OcrResult
- Không gọi OCR, không xử lý ảnh
"""

import logging
import re
from typing import Optional

from models.ocr_response import OcrResult
from utils.regex_utils import (
    PATTERN_LABEL_DATE_OF_BIRTH,
    PATTERN_LABEL_FULL_NAME,
    PATTERN_LABEL_ISSUE_DATE,
    PATTERN_LABEL_EXPIRY_DATE,
    PATTERN_LABEL_PLACE_OF_ORIGIN,
    PATTERN_LABEL_PLACE_OF_RESIDENCE,
    PATTERN_LABEL_PERSONAL_IDENTIFICATION,
    PATTERN_LABEL_ISSUE_PLACE,
    NOISE_ADDRESS_PATTERNS,
    Gender,
    _clean_address,
    clean_text,
    extract_after_label,
    extract_all_dates,
    extract_first_date,
    extract_gender,
    extract_identity_number,
    extract_nationality,
    fix_issue_place,
    fix_personal_identification,
    is_noise_line,
    normalize_date,
    normalize_unicode,
    PATTERN_DATE,
    restore_vietnamese_accents,
)

logger = logging.getLogger(__name__)


class CCCDParser:
    """
    Parser CCCD Việt Nam theo Clean Architecture.

    Nhận danh sách text dòng từ PaddleOCR, áp dụng
    chiến lược trích xuất từng trường dựa trên regex + context.
    """

    def parse(self, ocr_lines: list[str], back_lines: list[str] = None) -> OcrResult:
        """
        Parse toàn bộ thông tin CCCD từ danh sách text dòng OCR.

        Args:
            ocr_lines: Danh sách các dòng text mặt trước.
            back_lines: Danh sách các dòng text mặt sau.

        Returns:
            OcrResult chứa các trường đã trích xuất (có thể None nếu không tìm thấy).
        """
        from utils.logger_utils import _debug_step
        _debug_step("PARSER")
        
        logger.debug(f"OCR Lines: {ocr_lines}")

        # Làm sạch danh sách dòng trước khi parse
        cleaned_lines = [clean_text(line) for line in ocr_lines if line.strip()]
        
        all_lines = cleaned_lines.copy()
        if back_lines:
            cleaned_back_lines = [clean_text(line) for line in back_lines if line.strip()]
            all_lines.extend(cleaned_back_lines)

        identity_number = self._extract_identity_number(cleaned_lines)
        full_name = self._extract_full_name(cleaned_lines)
        date_of_birth = self._extract_date_of_birth(cleaned_lines)
        gender = self._extract_gender(cleaned_lines)
        nationality = self._extract_nationality(cleaned_lines)
        
        # Origin and Residence can be on front or back depending on card version
        place_of_residence = self._extract_place_of_residence(all_lines)
        
        issue_date = self._extract_issue_date(all_lines)
        expiry_date = self._extract_expiry_date(cleaned_lines)


        result = OcrResult(
            identityNumber=identity_number,
            fullName=full_name,
            dateOfBirth=date_of_birth,
            gender=gender,
            nationality=nationality,
            placeOfResidence=place_of_residence,
            issueDate=issue_date,
            expiryDate=expiry_date,
        )

        if logger.isEnabledFor(logging.DEBUG):
            logger.debug("=" * 80)
            logger.debug("FINAL PARSED RESULT")
            logger.debug("=" * 80)
            logger.debug(f"identityNumber: {identity_number}")
            logger.debug(f"fullName: {full_name}")
            logger.debug(f"dateOfBirth: {date_of_birth}")
            logger.debug(f"gender: {gender}")
            logger.debug(f"nationality: {nationality}")
            logger.debug(f"placeOfResidence: {place_of_residence}")
            logger.debug(f"issueDate: {issue_date}")
            logger.debug(f"expiryDate: {expiry_date}")
            logger.debug("=" * 80)

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
            name = restore_vietnamese_accents(name)
            logger.info(f"[CCCD] fullName (via label): {name}")
            return name

        # Chiến lược 2: Tìm từ MRZ (dòng chứa 'HUYNH<<QUANG<LE')
        import re
        for line in lines:
            if '<<' in line and re.search(r'[A-Z]{2,}<+[A-Z]{2,}', line.upper()):
                # Parse MRZ name line: "HUYNH<<QUANG<LE" -> "HUYNH QUANG LE"
                raw_mrz = line.upper().split('<<')[0]
                mrz_parts = [p.replace('<', ' ').strip() for p in line.upper().split('<<') if p.strip('<')]
                clean_mrz = ' '.join(mrz_parts).strip()
                clean_mrz = re.sub(r'[^A-Z\s]', '', clean_mrz)
                clean_mrz = re.sub(r'\s+', ' ', clean_mrz).strip()
                if 2 <= len(clean_mrz.split()) <= 6:
                    res_name = restore_vietnamese_accents(clean_mrz)
                    logger.info(f"[CCCD] fullName (via MRZ): {res_name}")
                    return res_name

        # Chiến lược 3 (fallback): Tìm dòng ALL CAPS dài hợp lệ
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
                name = restore_vietnamese_accents(name)
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
            date_match = PATTERN_DATE.search(normalize_unicode(value))
            if date_match:
                raw = f"{date_match.group(1)}/{date_match.group(2)}/{date_match.group(3)}"
                dob = normalize_date(raw)
                if dob:
                    logger.info("[CCCD] dateOfBirth (via label): %s", dob)
                    return dob

        # Chiến lược 2: Ngày đầu tiên trong text
        dob = extract_first_date(lines)
        if dob:
            logger.info("[CCCD] dateOfBirth (fallback first date): %s", dob)
        else:
            logger.warning("[CCCD] Không tìm thấy dateOfBirth.")
        return dob

    def _extract_gender(self, lines: list[str]) -> Optional[str]:
        """Trích xuất giới tính, trả về 'MALE' hoặc 'FEMALE'."""
        gender = extract_gender(lines)
        if gender is not None:
            # Gender is a str-Enum: Gender.MALE.value == 'MALE'
            value = gender.value if isinstance(gender, Gender) else str(gender)
            logger.info("[CCCD] gender: %s", value)
            return value
        logger.warning("[CCCD] Không tìm thấy gender.")
        return None

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
            value = _clean_address(value)
            logger.info(f"[CCCD] placeOfOrigin: {value}")
        else:
            logger.warning("[CCCD] Không tìm thấy placeOfOrigin.")
        return value

    def _extract_place_of_residence(self, lines: list[str]) -> Optional[str]:
        """
        Trích xuất nơi thường trú.
        """
        for i, line in enumerate(lines):
            match = PATTERN_LABEL_PLACE_OF_RESIDENCE.search(line)
            if match:
                addr_parts = []
                # 1. Remainder on same line (even if fused without colon)
                remainder = match.group(1).strip()
                remainder = re.sub(r"^[:/\s\-\.]+", "", remainder).strip()
                # Remove English labels that might be in the remainder
                remainder = re.sub(r"(?i)^(?:place\s*of\s*residence|residence|place\s*of\s*origin)\s*[:\-\.]?\s*", "", remainder).strip()
                if remainder and len(remainder) > 1 and not NOISE_ADDRESS_PATTERNS.search(remainder):
                    addr_parts.append(remainder)

                # 2. Check next 3 lines for continuation
                for j in range(1, 4):
                    if i + j < len(lines):
                        next_line = lines[i + j].strip()
                        if not next_line:
                            continue
                        if self._is_any_label(next_line):
                            if re.search(r"(?i)^(?:place\s*of\s*residence|residence|place\s*of\s*origin)\s*[:\-\.]?\s*$", next_line):
                                continue
                            break
                        if NOISE_ADDRESS_PATTERNS.search(next_line):
                            continue
                        if PATTERN_DATE.search(next_line):
                            continue
                        addr_parts.append(next_line)

                if addr_parts:
                    combined = ", ".join(addr_parts)
                    res = _clean_address(combined)
                    if res:
                        logger.info(f"[CCCD] placeOfResidence: {res}")
                        return res

        logger.debug("[CCCD] Không tìm thấy placeOfResidence.")
        return None

    def _extract_issue_date(self, lines: list[str]) -> Optional[str]:
        """
        Trích xuất ngày cấp CCCD.

        Chiến lược:
        1. Tìm ngày sau label "Ngày cấp" / "Date of issue"
        2. Fallback: lấy ngày áp chót trong text (ngày cuối thường là ngày hết hạn)
        """
        # Chiến lược 1: Label
        value = extract_after_label(lines, PATTERN_LABEL_ISSUE_DATE)
        if value:
            date_match = PATTERN_DATE.search(normalize_unicode(value))
            if date_match:
                raw = f"{date_match.group(1)}/{date_match.group(2)}/{date_match.group(3)}"
                issue = normalize_date(raw)
                if issue:
                    logger.info("[CCCD] issueDate (via label): %s", issue)
                    return issue

        # Chiến lược 2: Lấy ngày sau ngày sinh (nếu có >= 2 ngày)
        all_dates = extract_all_dates(lines)
        if len(all_dates) >= 3:
            # Thứ tự ngày trên CCCD: [dateOfBirth, issueDate, expiryDate]
            # issueDate là ngày áp chót
            issue = all_dates[-2]
            logger.info(f"[CCCD] issueDate (fallback 2nd-last of {len(all_dates)} dates): {issue}")
            return issue
        if len(all_dates) == 2:
            # Có 2 ngày: [dateOfBirth, issueDate] hoặc [issueDate, expiryDate]
            # Ngày thứ 2 có thể là issueDate (nếu không có expiry riêng)
            issue = all_dates[1]
            logger.info(f"[CCCD] issueDate (fallback 2nd of 2 dates): {issue}")
            return issue

        logger.warning("[CCCD] Không tìm thấy issueDate.")
        return None

    def _extract_expiry_date(self, lines: list[str]) -> Optional[str]:
        """
        Trích xuất ngày hết hạn CCCD.

        Chiến lược:
        1. Tìm ngày sau label "Có giá trị đến" / "Date of expiry"
        2. Fallback: lấy ngày cuối cùng trong text
        """
        # Chiến lược 1: Label
        value = extract_after_label(lines, PATTERN_LABEL_EXPIRY_DATE)
        if value:
            date_match = PATTERN_DATE.search(normalize_unicode(value))
            if date_match:
                raw = f"{date_match.group(1)}/{date_match.group(2)}/{date_match.group(3)}"
                expiry = normalize_date(raw)
                if expiry:
                    logger.info("[CCCD] expiryDate (via label): %s", expiry)
                    return expiry

        # Chiến lược 2: Đọc ngày hết hạn từ dòng MRZ (ví dụ: '0410047M2910046VNM' -> '04/10/2029')
        import re
        for line in lines:
            mrz_match = re.search(r'\d{6}[MF]\d{6}', line.upper())
            if mrz_match:
                mrz_str = mrz_match.group(0)
                exp_part = mrz_str[7:13]  # '291004' -> YYMMDD
                yy, mm, dd = exp_part[0:2], exp_part[2:4], exp_part[4:6]
                if mm.isdigit() and dd.isdigit() and 1 <= int(mm) <= 12 and 1 <= int(dd) <= 31:
                    year = f"20{yy}"
                    expiry = f"{dd}/{mm}/{year}"
                    logger.info(f"[CCCD] expiryDate (via MRZ {mrz_str}): {expiry}")
                    return expiry

        # Chiến lược 3: Lấy ngày cuối cùng trong text (nếu khác issueDate hoặc có >=2 ngày)
        all_dates = extract_all_dates(lines)
        if len(all_dates) >= 2:
            expiry = all_dates[-1]
            logger.info(f"[CCCD] expiryDate (fallback last of {len(all_dates)} dates): {expiry}")
            return expiry

        logger.warning("[CCCD] Không tìm thấy expiryDate.")
        return None

    def _extract_personal_identification(self, lines: list[str]) -> Optional[str]:
        """
        Trích xuất Đặc điểm nhận dạng (ở mặt sau CCCD).
        """
        for i, line in enumerate(lines):
            if PATTERN_LABEL_PERSONAL_IDENTIFICATION.search(line):
                val = extract_after_label(lines[i:], PATTERN_LABEL_PERSONAL_IDENTIFICATION)
                if val:
                    # Thử ghép dòng tiếp theo nếu có (ví dụ "canh-mui phai")
                    for j in range(1, 3):
                        if i + j < len(lines):
                            nxt = lines[i + j].strip()
                            if nxt and not self._is_any_label(nxt) and not PATTERN_DATE.search(nxt):
                                if any(kw in nxt.lower() for kw in ["cánh", "canh", "mũi", "mui", "phải", "phai", "trái", "trai", "tai"]):
                                    val = val + " " + nxt
                    val = clean_text(val)
                    val = fix_personal_identification(val)
                    logger.info(f"[CCCD] personalIdentification (via label): {val}")
                    return val

        # Fallback: Tìm dòng chứa từ khóa nhận dạng như "Sẹo", "Nốt ruồi", "Chấm"...
        for i, line in enumerate(lines):
            line_lower = line.lower()
            if any(kw in line_lower for kw in ["sẹo", "seo", "nốt ruồi", "not ruoi", "chấm", "cham"]):
                clean_val = clean_text(line)
                # Thử ghép dòng kế tiếp nếu có
                if i + 1 < len(lines):
                    nxt = lines[i + 1].strip()
                    if nxt and not self._is_any_label(nxt) and not PATTERN_DATE.search(nxt):
                        if any(kw in nxt.lower() for kw in ["cánh", "canh", "mũi", "mui", "phải", "phai", "trái", "trai"]):
                            clean_val = clean_val + " " + nxt
                clean_val = fix_personal_identification(clean_val)
                logger.info(f"[CCCD] personalIdentification (fallback kw): {clean_val}")
                return clean_val

        logger.debug("[CCCD] Không tìm thấy personalIdentification.")
        return None

    def _extract_issue_place(self, lines: list[str]) -> Optional[str]:
        """
        Trích xuất Nơi cấp / Cơ quan cấp CCCD (ở mặt sau CCCD).
        """
        for i, line in enumerate(lines):
            line_upper = line.upper()
            if any(kw in line_upper for kw in [
                "CỤC TRƯỜNG", "CUC TRUONG", "CỤC CẢNH SÁT", "CUC CANH SAT",
                "GIÁM ĐỐC CÔNG AN", "GIAM DOC CONG AN", "BỘ CÔNG AN", "BO CONG AN",
                "DIRECTOR GENERAL", "POLICE DEPARTMENT", "BOCONGAN", "MNISTRY"
            ]):
                place = line.strip()
                if i + 1 < len(lines):
                    next_line = lines[i + 1].strip()
                    next_upper = next_line.upper()
                    if any(sub_kw in next_upper for sub_kw in [
                        "QUẢN LÝ", "QUAN LY", "HÀNH CHÍNH", "HANH CHINH",
                        "TRẬT TỰ", "TRAT TU", "POLICE", "ADMINISTRATIVE", "MANAGEMENT", "SOCIAL ORDER"
                    ]):
                        place = place + " " + next_line
                place = clean_text(place)
                place = fix_issue_place(place)
                logger.info(f"[CCCD] issuePlace: {place}")
                return place

        logger.debug("[CCCD] Không tìm thấy issuePlace.")
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
            # Chỉ ghép nếu:
            # - Không rỗng
            # - Không phải label
            # - Không phải noise (text tiếng Anh từ mặt sau CCCD)
            # - Không chứa ngày tháng
            # - Không quá dài
            if (
                next_line
                and len(next_line) < 100
                and not CCCDParser._is_any_label_static(next_line)
                and not PATTERN_DATE.search(next_line)
                and not NOISE_ADDRESS_PATTERNS.search(next_line)
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
            PATTERN_LABEL_EXPIRY_DATE,
            PATTERN_LABEL_PERSONAL_IDENTIFICATION,
            PATTERN_LABEL_ISSUE_PLACE,
        )
        patterns = [
            PATTERN_LABEL_FULL_NAME,
            PATTERN_LABEL_DATE_OF_BIRTH,
            PATTERN_LABEL_PLACE_OF_ORIGIN,
            PATTERN_LABEL_PLACE_OF_RESIDENCE,
            PATTERN_LABEL_ISSUE_DATE,
            PATTERN_LABEL_EXPIRY_DATE,
            PATTERN_LABEL_PERSONAL_IDENTIFICATION,
            PATTERN_LABEL_ISSUE_PLACE,
        ]
        return any(p.search(line) for p in patterns)

    def _is_any_label(self, line: str) -> bool:
        """Instance method wrapper."""
        return self._is_any_label_static(line)
