"""
services/face_service.py

Service wrapper cho InsightFace.

Thực hiện:
- Khởi tạo FaceAnalysis model (buffalo_l)
- Phát hiện khuôn mặt (detect_face)
- Trích xuất embedding (extract_embedding)
- So sánh cosine similarity (compare_faces)
- Xác minh danh tính (verify)

Áp dụng Singleton pattern để load model một lần duy nhất.
"""

import logging
from typing import Optional

import numpy as np

logger = logging.getLogger(__name__)

# Threshold cosine similarity mặc định để xác nhận khuôn mặt khớp nhau
DEFAULT_THRESHOLD: float = 0.70


class FaceService:
    """
    Singleton service wrapper cho InsightFace FaceAnalysis.

    Model buffalo_l sẽ được tự động tải về lần đầu (~500MB).
    Sau đó model được cache tại ~/.insightface/models/buffalo_l/.
    """

    _instance: Optional["FaceService"] = None
    _app = None  # InsightFace FaceAnalysis instance

    def __new__(cls) -> "FaceService":
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    def initialize(self, model_name: str = "buffalo_l") -> None:
        """
        Khởi tạo InsightFace FaceAnalysis model.

        Args:
            model_name: Tên model InsightFace (mặc định: buffalo_l).

        Raises:
            RuntimeError: Nếu không thể khởi tạo model.
        """
        if self._app is not None:
            logger.info("InsightFace đã được khởi tạo, bỏ qua.")
            return

        try:
            logger.info(f"Đang khởi tạo InsightFace model: {model_name}...")
            import insightface
            from insightface.app import FaceAnalysis

            self._app = FaceAnalysis(
                name=model_name,
                providers=["CPUExecutionProvider"],  # CPU-only, không cần GPU
            )
            # ctx_id=-1: sử dụng CPU; det_size: kích thước ảnh detect face
            self._app.prepare(ctx_id=-1, det_size=(640, 640))
            logger.info(f"InsightFace model '{model_name}' khởi tạo thành công.")
        except ImportError as e:
            logger.error("Không tìm thấy insightface. Hãy chạy: pip install insightface onnxruntime")
            raise RuntimeError(f"InsightFace import failed: {e}") from e
        except Exception as e:
            logger.error(f"Lỗi khởi tạo InsightFace: {e}")
            raise RuntimeError(f"InsightFace initialization failed: {e}") from e

    def detect_face(self, img: np.ndarray):
        """
        Phát hiện khuôn mặt trong ảnh và trả về face object quan trọng nhất.

        InsightFace trả về danh sách các face objects, mỗi object chứa:
        - .bbox: [x1, y1, x2, y2] bounding box
        - .embedding: feature vector 512-dim
        - .det_score: độ tin cậy detect
        - .kps: keypoints (mắt, mũi, miệng)

        Chọn khuôn mặt có diện tích bbox lớn nhất (khuôn mặt chính).

        Args:
            img: Ảnh numpy array (BGR format từ OpenCV).

        Returns:
            InsightFace Face object của khuôn mặt lớn nhất,
            hoặc None nếu không phát hiện được.

        Raises:
            RuntimeError: Nếu FaceService chưa được khởi tạo.
        """
        self._ensure_initialized()

        try:
            import cv2
            # InsightFace cần RGB, OpenCV dùng BGR
            img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
            faces = self._app.get(img_rgb)

            if not faces:
                logger.info("Không phát hiện được khuôn mặt trong ảnh.")
                return None

            # Chọn khuôn mặt có bounding box lớn nhất
            main_face = self._select_largest_face(faces)
            logger.info(
                f"Phát hiện {len(faces)} khuôn mặt, "
                f"chọn face có det_score={main_face.det_score:.3f}, "
                f"bbox={main_face.bbox.tolist()}"
            )
            return main_face

        except Exception as e:
            logger.error(f"Lỗi khi detect face: {e}")
            raise RuntimeError(f"Face detection failed: {e}") from e

    def extract_embedding(self, img: np.ndarray) -> Optional[np.ndarray]:
        """
        Trích xuất face embedding vector từ ảnh.

        Embedding là vector 512 chiều đặc trưng cho khuôn mặt,
        được dùng để so sánh cosine similarity.

        Args:
            img: Ảnh numpy array (BGR format).

        Returns:
            numpy array 512-dim (embedding vector) hoặc None nếu không tìm thấy face.

        Raises:
            RuntimeError: Nếu FaceService chưa được khởi tạo.
        """
        face = self.detect_face(img)
        if face is None:
            logger.warning("Không thể trích xuất embedding: không tìm thấy khuôn mặt.")
            return None

        embedding = face.embedding
        if embedding is None:
            logger.warning("Face không có embedding vector.")
            return None

        # Chuẩn hóa L2 để cosine similarity chính xác hơn
        norm = np.linalg.norm(embedding)
        if norm > 0:
            embedding = embedding / norm

        logger.debug(f"Đã trích xuất embedding: shape={embedding.shape}, norm={np.linalg.norm(embedding):.4f}")
        return embedding

    def compare_faces(
        self,
        embedding1: np.ndarray,
        embedding2: np.ndarray
    ) -> float:
        """
        So sánh hai embedding vectors bằng cosine similarity.

        Cosine similarity = (A · B) / (||A|| * ||B||)
        Giá trị trong khoảng [-1, 1], clip về [0, 1] để dễ diễn giải.

        - 1.0: Hoàn toàn giống nhau
        - 0.0: Hoàn toàn khác nhau
        - >= 0.75: Thường xem là cùng người

        Args:
            embedding1: Embedding vector của khuôn mặt thứ nhất.
            embedding2: Embedding vector của khuôn mặt thứ hai.

        Returns:
            Điểm cosine similarity trong khoảng [0.0, 1.0].
        """
        try:
            # Đảm bảo vectors đã được chuẩn hóa L2
            norm1 = np.linalg.norm(embedding1)
            norm2 = np.linalg.norm(embedding2)

            if norm1 == 0 or norm2 == 0:
                logger.warning("Embedding vector có norm = 0, trả về similarity = 0.0")
                return 0.0

            e1 = embedding1 / norm1
            e2 = embedding2 / norm2

            # Cosine similarity = dot product của hai vector đã normalize
            similarity = float(np.dot(e1, e2))

            # Clip về [0, 1] (cosine similarity có thể âm)
            similarity = float(np.clip(similarity, 0.0, 1.0))
            logger.info(f"Cosine similarity: {similarity:.4f}")
            return similarity

        except Exception as e:
            logger.error(f"Lỗi khi tính cosine similarity: {e}")
            return 0.0

    def verify(
        self,
        id_card_img: np.ndarray,
        selfie_img: np.ndarray,
        threshold: float = DEFAULT_THRESHOLD
    ) -> tuple[bool, float, Optional[str]]:
        """
        Xác minh khuôn mặt selfie có khớp với ảnh trên CCCD không.

        Luồng:
        1. Detect face trên ảnh CCCD
        2. Detect face trên ảnh selfie
        3. Extract embedding cho cả hai
        4. Tính cosine similarity
        5. So sánh với threshold

        Args:
            id_card_img: Ảnh CCCD (BGR numpy array).
            selfie_img: Ảnh selfie (BGR numpy array).
            threshold: Ngưỡng similarity để xác nhận (mặc định 0.75).

        Returns:
            Tuple (verified: bool, similarity: float, error_message: Optional[str])
            - verified: True nếu similarity >= threshold
            - similarity: Điểm cosine similarity
            - error_message: Thông báo lỗi nếu có (vd: không tìm thấy face)
        """
        # Bước 1: Detect face trên CCCD
        logger.info("Đang phát hiện khuôn mặt trên ảnh CCCD...")
        id_face = self.detect_face(id_card_img)
        if id_face is None:
            logger.warning("Không tìm thấy khuôn mặt trên CCCD.")
            return False, 0.0, "Face not found on ID card"

        # Bước 2: Detect face trên selfie
        logger.info("Đang phát hiện khuôn mặt trên ảnh selfie...")
        selfie_face = self.detect_face(selfie_img)
        if selfie_face is None:
            logger.warning("Không tìm thấy khuôn mặt trên selfie.")
            return False, 0.0, "Face not found on selfie"

        # Bước 3: Extract embeddings
        id_embedding = id_face.embedding
        selfie_embedding = selfie_face.embedding

        if id_embedding is None or selfie_embedding is None:
            logger.error("Không thể trích xuất embedding từ một hoặc cả hai khuôn mặt.")
            return False, 0.0, "Failed to extract face embedding"

        # Bước 4: Tính cosine similarity
        similarity = self.compare_faces(id_embedding, selfie_embedding)

        # Bước 5: So sánh với threshold
        verified = similarity >= threshold
        logger.info(
            f"Kết quả xác minh: similarity={similarity:.4f}, "
            f"threshold={threshold}, verified={verified}"
        )

        return verified, similarity, None

    # ------------------------------------------------------------------
    # PRIVATE HELPERS
    # ------------------------------------------------------------------

    def _ensure_initialized(self) -> None:
        """Đảm bảo service đã được khởi tạo trước khi sử dụng."""
        if self._app is None:
            raise RuntimeError(
                "FaceService chưa được khởi tạo. Hãy gọi initialize() trước."
            )

    @staticmethod
    def _select_largest_face(faces: list) -> object:
        """
        Chọn khuôn mặt có diện tích bounding box lớn nhất.

        Args:
            faces: Danh sách InsightFace Face objects.

        Returns:
            Face object có bbox lớn nhất.
        """
        def bbox_area(face) -> float:
            bbox = face.bbox
            return (bbox[2] - bbox[0]) * (bbox[3] - bbox[1])

        return max(faces, key=bbox_area)

    @property
    def is_initialized(self) -> bool:
        """Kiểm tra FaceService đã được khởi tạo chưa."""
        return self._app is not None


# Singleton instance dùng chung toàn bộ ứng dụng
face_service = FaceService()
