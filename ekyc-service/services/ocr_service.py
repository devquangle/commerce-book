"""
services/ocr_service.py

Service wrapper cho PaddleOCR.

Áp dụng Singleton pattern để chỉ khởi tạo model một lần,
tránh overhead lớn khi load model mỗi request.

Trách nhiệm:
- Khởi tạo và quản lý vòng đời PaddleOCR model
- Thực hiện OCR trên ảnh và trả về danh sách text dòng
"""

import logging
from pathlib import Path
from typing import Optional

import numpy as np

logger = logging.getLogger(__name__)


class OcrService:
    """
    Singleton service wrapper cho PaddleOCR.

    PaddleOCR được khởi tạo một lần trong suốt vòng đời ứng dụng
    để tránh thời gian load model (~5-10 giây) mỗi request.
    """

    _instance: Optional["OcrService"] = None
    _ocr = None  # PaddleOCR instance

    def __new__(cls) -> "OcrService":
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    def initialize(self) -> None:
        """
        Khởi tạo PaddleOCR model.

        Sử dụng:
        - lang='vi': Vietnamese language model (tốt nhất cho CCCD VN)
        - use_angle_cls=True: Phát hiện góc nghiêng văn bản
        - use_gpu=False: CPU-only để không phụ thuộc CUDA

        Raises:
            RuntimeError: Nếu không thể khởi tạo PaddleOCR.
        """
        if self._ocr is not None:
            logger.info("[OCR] PaddleOCR already initialized, skipping.")
            return

        try:
            logger.info("[OCR] Initializing PaddleOCR model (lang=vi)...")
            from paddleocr import PaddleOCR

            self._ocr = PaddleOCR(
                use_angle_cls=True,    # Xử lý văn bản nghiêng/xoay
                lang="vi",             # Tiếng Việt
                use_gpu=False,         # CPU inference
                show_log=False,        # Tắt verbose log của PaddleOCR
                enable_mkldnn=False,   # Tắt MKL-DNN
            )
            logger.info("[OCR] PaddleOCR initialized successfully.")
        except ImportError as e:
            logger.error(f"[OCR] Cannot find paddleocr package: {e}")
            raise RuntimeError(f"PaddleOCR import failed: {e}") from e
        except Exception as e:
            logger.error(f"[OCR] Initialization error: {e}")
            raise RuntimeError(f"PaddleOCR initialization failed: {e}") from e

    def extract_text(self, image_path: str) -> list[str]:
        """
        Thực hiện OCR trên ảnh và trả về danh sách text dòng.

        Args:
            image_path: Đường dẫn tới file ảnh cần OCR.

        Returns:
            Danh sách các chuỗi text (mỗi phần tử là một vùng text phát hiện được).

        Raises:
            RuntimeError: Nếu OCR service chưa được khởi tạo.
            FileNotFoundError: Nếu file ảnh không tồn tại.
        """
        if self._ocr is None:
            raise RuntimeError(
                "OcrService chưa được khởi tạo. Hãy gọi initialize() trước."
            )

        if not Path(image_path).exists():
            raise FileNotFoundError(f"Không tìm thấy file ảnh: {image_path}")

        try:
            logger.info(f"Đang chạy OCR trên: {image_path}")
            result = self._ocr.ocr(image_path, cls=True)

            text_lines = self._parse_ocr_result(result)
            logger.info(f"OCR hoàn tất: trích xuất được {len(text_lines)} dòng text.")
            logger.debug(f"OCR text lines: {text_lines}")

            return text_lines

        except FileNotFoundError:
            raise
        except Exception as e:
            logger.error(f"Lỗi khi chạy OCR trên {image_path}: {e}")
            raise RuntimeError(f"OCR extraction failed: {e}") from e

    def extract_text_from_array(self, img: np.ndarray) -> list[str]:
        """
        Thực hiện OCR trên numpy array (không cần save file tạm).

        Args:
            img: Ảnh dạng numpy array (BGR hoặc RGB).

        Returns:
            Danh sách các chuỗi text.

        Raises:
            RuntimeError: Nếu OCR service chưa được khởi tạo.
        """
        if self._ocr is None:
            raise RuntimeError(
                "OcrService chưa được khởi tạo. Hãy gọi initialize() trước."
            )

        try:
            logger.info("Đang chạy OCR trên numpy array...")
            result = self._ocr.ocr(img, cls=True)

            text_lines = self._parse_ocr_result(result)
            logger.info(f"OCR hoàn tất: {len(text_lines)} dòng text.")
            return text_lines

        except Exception as e:
            logger.error(f"Lỗi khi chạy OCR trên array: {e}")
            raise RuntimeError(f"OCR extraction failed: {e}") from e

    @staticmethod
    def _parse_ocr_result(result) -> list[str]:
        """
        Chuyển đổi kết quả thô từ PaddleOCR thành danh sách text dòng.

        Cấu trúc PaddleOCR result:
        [
          [  # Page/image
            [  # Text block
              [[x1,y1],[x2,y2],[x3,y3],[x4,y4]],  # Bounding box
              ("text content", confidence_score)    # Text + confidence
            ],
            ...
          ]
        ]

        Args:
            result: Kết quả thô từ PaddleOCR.

        Returns:
            Danh sách chuỗi text đã lọc (confidence >= 0.5).
        """
        text_lines = []

        if result is None:
            logger.warning("PaddleOCR trả về None.")
            return text_lines

        for page in result:
            if page is None:
                continue
            for line in page:
                if line is None or len(line) < 2:
                    continue
                text_info = line[1]
                if text_info and len(text_info) >= 2:
                    text = text_info[0]
                    confidence = text_info[1]
                    # Chỉ lấy text có confidence >= 50%
                    if confidence >= 0.5 and text and text.strip():
                        text_lines.append(text.strip())

        return text_lines

    @property
    def is_initialized(self) -> bool:
        """Kiểm tra OCR service đã được khởi tạo chưa."""
        return self._ocr is not None


# Singleton instance dùng chung toàn bộ ứng dụng
ocr_service = OcrService()
