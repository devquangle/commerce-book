"""
services/ekyc_service.py

Service orchestrator cho toàn bộ quy trình eKYC.

Điều phối:
1. OCR trên ảnh CCCD → trích xuất thông tin
2. Phát hiện khuôn mặt trên CCCD
3. Phát hiện khuôn mặt trên ảnh selfie
4. So sánh embedding → xác minh

Áp dụng Dependency Injection: nhận OcrService và FaceService từ bên ngoài,
không tự khởi tạo, để dễ test và thay thế.
"""

import logging

from models.ekyc_response import EkycResponse
from models.ocr_response import OcrResult
from parsers.cccd_parser import CCCDParser
from services.face_service import FaceService, DEFAULT_THRESHOLD
from services.ocr_service import OcrService
from utils.image_utils import load_image_from_bytes, normalize_image

logger = logging.getLogger(__name__)


class EkycService:
    """
    Orchestrator service cho quy trình eKYC Việt Nam.

    Nhận OcrService và FaceService qua constructor (Dependency Injection),
    điều phối toàn bộ flow từ ảnh thô → EkycResponse.
    """

    def __init__(
        self,
        ocr_service: OcrService,
        face_service: FaceService,
        threshold: float = DEFAULT_THRESHOLD,
    ) -> None:
        """
        Khởi tạo EkycService với các dependency.

        Args:
            ocr_service: Instance của OcrService đã được khởi tạo.
            face_service: Instance của FaceService đã được khởi tạo.
            threshold: Ngưỡng cosine similarity để xác nhận khuôn mặt khớp.
        """
        self._ocr_service = ocr_service
        self._face_service = face_service
        self._threshold = threshold
        self._parser = CCCDParser()
        logger.info(
            f"EkycService khởi tạo với threshold={threshold}"
        )

    async def process_ekyc(
        self,
        id_card_path: str,
        selfie_path: str,
    ) -> EkycResponse:
        """
        Xử lý toàn bộ quy trình eKYC.

        Args:
            id_card_path: Đường dẫn tới ảnh CCCD đã lưu tạm.
            selfie_path: Đường dẫn tới ảnh selfie đã lưu tạm.

        Returns:
            EkycResponse chứa kết quả đầy đủ (OCR + face verification).
        """
        logger.info("=" * 60)
        logger.info("BẮT ĐẦU QUY TRÌNH eKYC")
        logger.info(f"  ID Card : {id_card_path}")
        logger.info(f"  Selfie  : {selfie_path}")
        logger.info("=" * 60)

        # ---------------------------------------------------------------
        # BƯỚC 2: OCR – Trích xuất thông tin CCCD
        # ---------------------------------------------------------------
        ocr_result = await self._run_ocr(id_card_path)

        # ---------------------------------------------------------------
        # BƯỚC 3 & 4 & 5: Face Verification
        # ---------------------------------------------------------------
        face_result = await self._run_face_verification(
            id_card_path=id_card_path,
            selfie_path=selfie_path,
        )

        # Nếu face_result là EkycResponse (lỗi face detection), trả về luôn
        if isinstance(face_result, EkycResponse):
            # Bổ sung OCR data vào error response
            face_result.ocr = ocr_result
            return face_result

        verified, similarity = face_result

        response = EkycResponse(
            success=True,
            message="Verification completed",
            verified=verified,
            similarity=round(similarity, 4),
            threshold=self._threshold,
            ocr=ocr_result,
        )

        logger.info(
            f"eKYC hoàn tất: verified={verified}, "
            f"similarity={similarity:.4f}"
        )
        return response

    async def _run_ocr(self, id_card_path: str) -> OcrResult | None:
        """
        Chạy OCR và parse thông tin CCCD.

        Args:
            id_card_path: Đường dẫn ảnh CCCD.

        Returns:
            OcrResult hoặc None nếu OCR thất bại.
        """
        try:
            logger.info("[BƯỚC 2] Đang chạy OCR trên ảnh CCCD...")
            text_lines = self._ocr_service.extract_text(id_card_path)

            if not text_lines:
                logger.warning("[BƯỚC 2] OCR không trích xuất được text nào.")
                return OcrResult()  # Trả về object rỗng (tất cả None)

            ocr_result = self._parser.parse(text_lines)
            logger.info("[BƯỚC 2] OCR và parse CCCD thành công.")
            return ocr_result

        except Exception as e:
            logger.error(f"[BƯỚC 2] Lỗi OCR: {e}", exc_info=True)
            # Không fail toàn bộ quy trình vì OCR lỗi
            # Vẫn tiếp tục face verification
            return OcrResult()

    async def _run_face_verification(
        self,
        id_card_path: str,
        selfie_path: str,
    ) -> tuple[bool, float] | EkycResponse:
        """
        Chạy face verification pipeline:
        - Load ảnh từ file
        - Detect face trên CCCD
        - Detect face trên selfie
        - Compare embeddings

        Args:
            id_card_path: Đường dẫn ảnh CCCD.
            selfie_path: Đường dẫn ảnh selfie.

        Returns:
            Tuple (verified, similarity) nếu thành công,
            hoặc EkycResponse với success=False nếu face không tìm thấy.
        """
        try:
            import cv2

            # Load ảnh CCCD
            logger.info("[BƯỚC 3] Đang load và xử lý ảnh CCCD...")
            id_img = cv2.imread(id_card_path)
            if id_img is None:
                logger.error(f"Không thể đọc ảnh CCCD: {id_card_path}")
                return EkycResponse(
                    success=False,
                    message="Cannot read ID card image",
                    threshold=self._threshold,
                )
            id_img = normalize_image(id_img)

            # Load ảnh selfie
            logger.info("[BƯỚC 4] Đang load và xử lý ảnh selfie...")
            selfie_img = cv2.imread(selfie_path)
            if selfie_img is None:
                logger.error(f"Không thể đọc ảnh selfie: {selfie_path}")
                return EkycResponse(
                    success=False,
                    message="Cannot read selfie image",
                    threshold=self._threshold,
                )
            selfie_img = normalize_image(selfie_img)

            # Face verification
            logger.info("[BƯỚC 5] Đang thực hiện face verification...")
            verified, similarity, error_msg = self._face_service.verify(
                id_card_img=id_img,
                selfie_img=selfie_img,
                threshold=self._threshold,
            )

            # Xử lý lỗi face detection
            if error_msg:
                logger.warning(f"[BƯỚC 5] Face verification lỗi: {error_msg}")
                return EkycResponse(
                    success=False,
                    message=error_msg,
                    threshold=self._threshold,
                )

            return verified, similarity

        except RuntimeError as e:
            logger.error(f"[BƯỚC 3-5] RuntimeError trong face verification: {e}", exc_info=True)
            return EkycResponse(
                success=False,
                message=f"Face verification error: {str(e)}",
                threshold=self._threshold,
            )
        except Exception as e:
            logger.error(f"[BƯỚC 3-5] Lỗi không mong muốn trong face verification: {e}", exc_info=True)
            return EkycResponse(
                success=False,
                message="Internal face verification error",
                threshold=self._threshold,
            )
