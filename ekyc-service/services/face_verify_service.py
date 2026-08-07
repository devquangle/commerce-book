"""
Face Verification Service using InsightFace (Singleton).
"""
import numpy as np
from core.config import settings
from core.logger import logger
from core.exception import FaceVerifyException
from models.response import FaceData
from scipy.spatial.distance import cosine

class FaceVerifyService:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            logger.info("Initializing InsightFace model (buffalo_l) - Singleton...")
            try:
                import insightface
                from insightface.app import FaceAnalysis
                cls._instance = super(FaceVerifyService, cls).__new__(cls)
                cls._instance.app = FaceAnalysis(name='buffalo_l')
                cls._instance.app.prepare(ctx_id=0, det_size=(640, 640))
                logger.info("InsightFace initialized successfully.")
            except ImportError:
                logger.error("InsightFace not installed. Using dummy implementation.")
                cls._instance = super(FaceVerifyService, cls).__new__(cls)
                cls._instance.app = None
        return cls._instance

    def _get_embedding(self, img: np.ndarray) -> np.ndarray:
        if self.app is None:
            # Dummy embedding for testing if not installed
            return np.random.rand(512)
            
        faces = self.app.get(img)
        if len(faces) == 0:
            raise FaceVerifyException("No face detected", "FACE_NOT_FOUND")
        if len(faces) > 1:
            raise FaceVerifyException("Multiple faces detected", "FACE_MULTIPLE_DETECTED")
            
        # Trả về embedding đã normalize
        face = faces[0]
        norm_emb = face.normed_embedding
        return norm_emb

    def verify_faces(self, card_face: np.ndarray, selfie_img: np.ndarray) -> FaceData:
        """
        Compare card face with selfie face using Cosine Similarity.
        """
        logger.info("Starting face verification...")
        try:
            emb1 = self._get_embedding(card_face)
            logger.info("Card face aligned and embedding extracted.")
            
            emb2 = self._get_embedding(selfie_img)
            logger.info("Selfie face aligned and embedding extracted.")
            
            # Tính Cosine Similarity (InsightFace embeddings are normalized)
            # scipy.spatial.distance.cosine returns 1 - similarity, so similarity = 1 - distance
            similarity = 1.0 - float(cosine(emb1, emb2))
            
            # Map similarity from [-1, 1] to [0, 1] if needed, but InsightFace usually outputs 0 to 1
            # For strict buffalo_l, threshold is around 0.45 for cosine similarity.
            
            threshold = settings.FACE_THRESHOLD
            matched = similarity >= threshold
            
            logger.info(f"Face matched: {matched} (Similarity: {similarity:.4f}, Threshold: {threshold})")
            
            return FaceData(
                matched=matched,
                similarity=round(similarity, 4),
                threshold=threshold
            )
        except FaceVerifyException as e:
            logger.warning(f"Face verification failed: {e.message}")
            raise e
        except Exception as e:
            logger.error(f"Unexpected error in face verify: {str(e)}")
            raise FaceVerifyException(f"Face verification error: {str(e)}", "FACE_VERIFY_ERROR")

# Export instance duy nhất
face_verify_service = FaceVerifyService()
