"""
services/card_detector.py

Service hỗ trợ phát hiện vùng CCCD, phát hiện mã QR, chip NFC và quốc huy.
Sử dụng OpenCV + Ultralytics (YOLO) + pyzbar (nếu có DLL) / OpenCV QRCodeDetector.
"""

import logging
import re
from typing import Optional

import cv2
import numpy as np

logger = logging.getLogger(__name__)


class CardDetector:
    """
    Detector service cho CCCD Việt Nam.
    """

    def __init__(self) -> None:
        self._qr_detector = cv2.QRCodeDetector()

    def detect_qr(self, img: np.ndarray) -> tuple[bool, Optional[str]]:
        """
        Phát hiện và giải mã QR code trên ảnh CCCD.
        Returns: (qr_detected: bool, qr_raw_data: str | None)
        """
        if img is None or img.size == 0:
            return False, None

        # 1. Thử pyzbar nếu có thư viện
        try:
            from pyzbar.pyzbar import decode
            decoded = decode(img)
            if decoded:
                data_str = decoded[0].data.decode("utf-8", errors="ignore").strip()
                if data_str:
                    logger.info(f"[CardDetector] pyzbar phát hiện QR: {data_str}")
                    return True, data_str
        except Exception:
            pass  # Fallback sang OpenCV nếu pyzbar thiếu DLL

        # 2. Thử OpenCV QRCodeDetector trên toàn bộ ảnh
        try:
            data, bbox, _ = self._qr_detector.detectAndDecode(img)
            if data and data.strip():
                logger.info(f"[CardDetector] OpenCV QR detect thành công: {data}")
                return True, data.strip()
            if bbox is not None and len(bbox) > 0:
                return True, None
        except Exception:
            pass

        # 3. Thử crop ROI góc trên phải (vùng QR chuẩn trên CCCD chip)
        try:
            h, w = img.shape[:2]
            qr_roi = img[0:int(h * 0.5), int(w * 0.5):w]
            gray = cv2.cvtColor(qr_roi, cv2.COLOR_BGR2GRAY)
            enhanced = cv2.equalizeHist(gray)

            data, bbox, _ = self._qr_detector.detectAndDecode(enhanced)
            if data and data.strip():
                logger.info(f"[CardDetector] OpenCV QR ROI detect thành công: {data}")
                return True, data.strip()
            if bbox is not None and len(bbox) > 0:
                return True, None
        except Exception:
            pass

        return False, None

    def detect_national_emblem(self, img: np.ndarray) -> bool:
        """
        Phát hiện Quốc huy Việt Nam ở góc trên-trái ảnh mặt trước CCCD.
        """
        if img is None or img.size == 0:
            return False
        try:
            h, w = img.shape[:2]
            roi = img[:int(h * 0.35), :int(w * 0.3)]
            hsv = cv2.cvtColor(roi, cv2.COLOR_BGR2HSV)
            # Dải màu vàng/đỏ của Quốc Huy Việt Nam
            lower_yellow = np.array([10, 70, 70])
            upper_yellow = np.array([40, 255, 255])
            mask = cv2.inRange(hsv, lower_yellow, upper_yellow)
            ratio = np.count_nonzero(mask) / mask.size
            return ratio > 0.03
        except Exception:
            return False

    def detect_chip(self, img: np.ndarray) -> bool:
        """
        Phát hiện Chip NFC (màu vàng kim loại trên CCCD chip mới).
        """
        if img is None or img.size == 0:
            return False
        try:
            h, w = img.shape[:2]
            # Chip NFC thường ở nửa bên trái của mặt trước/sau
            roi = img[int(h * 0.2):int(h * 0.8), :int(w * 0.4)]
            hsv = cv2.cvtColor(roi, cv2.COLOR_BGR2HSV)
            lower_gold = np.array([15, 60, 100])
            upper_gold = np.array([35, 255, 255])
            mask = cv2.inRange(hsv, lower_gold, upper_gold)
            ratio = np.count_nonzero(mask) / mask.size
            return ratio > 0.02
        except Exception:
            return False


card_detector = CardDetector()
