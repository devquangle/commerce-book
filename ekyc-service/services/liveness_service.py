"""
Liveness Detection Service using PlaceLive SDK/API.
"""
import numpy as np
from core.config import settings
from core.logger import logger
from core.exception import LivenessException
from models.response import LivenessData
import random

class LivenessService:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            logger.info("Initializing PlaceLive Liveness client (Singleton)...")
            cls._instance = super(LivenessService, cls).__new__(cls)
            cls._instance.api_key = settings.PLACE_LIVE_API_KEY
            cls._instance.secret = settings.PLACE_LIVE_SECRET
            # Khởi tạo HTTP client hoặc SDK client ở đây
        return cls._instance

    def check_liveness(self, selfie_img: np.ndarray) -> LivenessData:
        """
        Gửi ảnh selfie lên PlaceLive API để kiểm tra liveness.
        """
        logger.info("Starting PlaceLive liveness check...")
        try:
            # ---------------------------------------------------------
            # MOCK IMPLEMENTATION (Thay thế bằng code gọi API thực tế)
            # ---------------------------------------------------------
            # img_base64 = image_to_base64(selfie_img)
            # response = httpx.post("https://api.placelive.com/v1/liveness", ...)
            # ...
            # Để minh họa production-ready logic, ta giả lập kết quả:
            
            logger.debug("PlaceLive request sent (mocked).")
            
            # Giả lập response thành công
            mock_score = random.uniform(0.9, 1.0)
            is_live = mock_score > 0.8
            attack_type = "none" if is_live else "screen"
            
            if not is_live:
                raise LivenessException("Liveness check failed", "LIVENESS_FAILED")
                
            logger.info(f"PlaceLive response received. isLive: {is_live}, score: {mock_score:.2f}")
            
            return LivenessData(
                isLive=is_live,
                score=round(mock_score, 4),
                attackType=attack_type,
                provider="PlaceLive"
            )
        except LivenessException as e:
            logger.warning(f"Liveness failed: {e.message}")
            raise e
        except Exception as e:
            logger.error(f"Error calling PlaceLive API: {str(e)}")
            raise LivenessException(f"Liveness check error: {str(e)}", "LIVENESS_ERROR")

# Export instance duy nhất
liveness_service = LivenessService()
