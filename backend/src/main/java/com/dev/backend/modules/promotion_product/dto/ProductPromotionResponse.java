package com.dev.backend.modules.promotion_product.dto;

import java.util.List;

public record ProductPromotionResponse(
        Long productId,
        PromotionProductResponse activePromotion,
        List<PromotionProductResponse> promotionHistory) {
}