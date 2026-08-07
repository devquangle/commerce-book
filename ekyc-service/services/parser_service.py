"""
OCR Parser Service.
Sử dụng regex từ utils để trích xuất thông tin.
"""
from typing import List, Optional
import re
from core.logger import logger
from models.response import OcrData
from utils.regex_utils import (
    extract_date,
    extract_identity_number,
    is_any_label,
    clean_address,
    PATTERN_GENDER,
    PATTERN_LABEL_PLACE_OF_RESIDENCE,
    PATTERN_LABEL_PLACE_OF_ORIGIN,
    NOISE_ADDRESS_PATTERNS
)
from utils.text_utils import convert_date_to_iso

class ParserService:
    @staticmethod
    def parse_ocr_lines(front_lines: List[str], back_lines: List[str] = None) -> OcrData:
        """
        Parse text OCR thành dữ liệu có cấu trúc.
        """
        all_lines = front_lines.copy()
        if back_lines:
            all_lines.extend(back_lines)

        data = OcrData()
        
        # Identity Number
        data.identityNumber = extract_identity_number(all_lines)

        # Full Name (thường nằm sau label Họ và tên, hoặc là chuỗi viết hoa hoàn toàn)
        data.fullName = ParserService._extract_full_name(all_lines)

        # Dates (Ngày sinh, Ngày cấp, Ngày hết hạn)
        dates = []
        for line in all_lines:
            d = extract_date(line)
            if d and d not in dates:
                dates.append(d)
        
        # Phân loại date (giả định theo thứ tự thời gian, đây chỉ là heuristic cơ bản,
        # thực tế cần dựa vào label hoặc dòng liền trước)
        if len(dates) >= 1:
            data.dateOfBirth = convert_date_to_iso(dates[0])
        if len(dates) >= 2:
            data.issueDate = convert_date_to_iso(dates[1])
        if len(dates) >= 3:
            data.expiryDate = convert_date_to_iso(dates[2])
            
        # Tạm thời gán nationality cố định hoặc regex nếu cần thiết
        for line in all_lines:
            if "việt nam" in line.lower() or "viet nam" in line.lower():
                data.nationality = "Việt Nam"
                break
                
        # Giới tính
        for line in all_lines:
            m = PATTERN_GENDER.search(line)
            if m:
                val = m.group(1).lower()
                data.gender = "Nam" if val in ("nam", "male") else "Nữ"
                break

        # Quê quán và Nơi cư trú
        data.placeOfOrigin = ParserService._extract_address(all_lines, PATTERN_LABEL_PLACE_OF_ORIGIN)
        data.placeOfResidence = ParserService._extract_address(all_lines, PATTERN_LABEL_PLACE_OF_RESIDENCE)

        logger.info("OCR Parser completed.")
        return data

    @staticmethod
    def _extract_full_name(lines: List[str]) -> Optional[str]:
        # Tạm thời regex viết hoa
        pattern = re.compile(r"^[A-Z\s]{4,}$")
        for line in lines:
            if pattern.match(line) and "CĂN CƯỚC" not in line and "CỘNG HÒA" not in line and "ĐỘC LẬP" not in line:
                return line.strip()
        return None

    @staticmethod
    def _extract_address(lines: List[str], label_pattern: re.Pattern) -> Optional[str]:
        """
        Logic trích xuất địa chỉ nhiều dòng, loại bỏ label tiếng Anh.
        """
        for i, line in enumerate(lines):
            match = label_pattern.search(line)
            if match:
                addr_parts = []
                remainder = match.group(1).strip()
                remainder = re.sub(r"^[:/\s\-\.]+", "", remainder).strip()
                remainder = re.sub(r"(?i)^(?:place\s*of\s*residence|residence|place\s*of\s*origin|place\s*of\s*birth)\s*[:\-\.]?\s*", "", remainder).strip()
                
                if remainder and len(remainder) > 1 and not NOISE_ADDRESS_PATTERNS.search(remainder):
                    addr_parts.append(remainder)

                # Check next 3 lines
                for j in range(1, 4):
                    if i + j < len(lines):
                        next_line = lines[i + j].strip()
                        if not next_line:
                            continue
                        if is_any_label(next_line):
                            if re.search(r"(?i)^(?:place\s*of\s*residence|residence|place\s*of\s*origin|place\s*of\s*birth)\s*[:\-\.]?\s*$", next_line):
                                continue
                            break
                        if NOISE_ADDRESS_PATTERNS.search(next_line):
                            continue
                        addr_parts.append(next_line)

                if addr_parts:
                    combined = ", ".join(addr_parts)
                    return clean_address(combined)
        return None
