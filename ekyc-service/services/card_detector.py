"""
Card Detection Service.
Phát hiện CCCD, crop, transform, deskew, rotate.
"""
import cv2
import numpy as np
from typing import Optional
from core.logger import logger
from core.exception import ValidationException

class CardDetector:
    @staticmethod
    def detect_and_crop(img: np.ndarray) -> np.ndarray:
        """
        Phát hiện thẻ, crop và perspective transform.
        Nếu không tìm thấy, trả về lỗi.
        Để đơn giản trong template này, nếu không tìm thấy contour phù hợp,
        sẽ trả về ảnh gốc (thực tế cần train YOLO/SSD hoặc dùng OpenCV nâng cao).
        """
        try:
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            blur = cv2.GaussianBlur(gray, (5, 5), 0)
            edged = cv2.Canny(blur, 75, 200)

            # Find contours
            contours, _ = cv2.findContours(edged.copy(), cv2.RETR_LIST, cv2.CHAIN_APPROX_SIMPLE)
            contours = sorted(contours, key=cv2.contourArea, reverse=True)[:5]

            card_contour = None
            for c in contours:
                peri = cv2.arcLength(c, True)
                approx = cv2.approxPolyDP(c, 0.02 * peri, True)
                if len(approx) == 4:
                    card_contour = approx
                    break
                    
            if card_contour is not None:
                logger.info("Card contour detected, applying perspective transform.")
                return CardDetector._four_point_transform(img, card_contour.reshape(4, 2))
            
            logger.warning("No card contour detected, using original image.")
            return img
        except Exception as e:
            logger.error(f"Error in detect_and_crop: {str(e)}")
            return img

    @staticmethod
    def _order_points(pts: np.ndarray) -> np.ndarray:
        rect = np.zeros((4, 2), dtype="float32")
        s = pts.sum(axis=1)
        rect[0] = pts[np.argmin(s)]
        rect[2] = pts[np.argmax(s)]
        diff = np.diff(pts, axis=1)
        rect[1] = pts[np.argmin(diff)]
        rect[3] = pts[np.argmax(diff)]
        return rect

    @staticmethod
    def _four_point_transform(image: np.ndarray, pts: np.ndarray) -> np.ndarray:
        rect = CardDetector._order_points(pts)
        (tl, tr, br, bl) = rect

        widthA = np.sqrt(((br[0] - bl[0]) ** 2) + ((br[1] - bl[1]) ** 2))
        widthB = np.sqrt(((tr[0] - tl[0]) ** 2) + ((tr[1] - tl[1]) ** 2))
        maxWidth = max(int(widthA), int(widthB))

        heightA = np.sqrt(((tr[0] - br[0]) ** 2) + ((tr[1] - br[1]) ** 2))
        heightB = np.sqrt(((tl[0] - bl[0]) ** 2) + ((tl[1] - bl[1]) ** 2))
        maxHeight = max(int(heightA), int(heightB))

        dst = np.array([
            [0, 0],
            [maxWidth - 1, 0],
            [maxWidth - 1, maxHeight - 1],
            [0, maxHeight - 1]], dtype="float32")

        M = cv2.getPerspectiveTransform(rect, dst)
        warped = cv2.warpPerspective(image, M, (maxWidth, maxHeight))
        return warped
