package com.dev.backend.modules.promotion_product.dto;

import java.time.LocalDateTime;

import com.dev.backend.common.enums.PromotionCampaignType;
import com.dev.backend.common.enums.PromotionStatus;

public record PromotionProductResponse(
    Long promotionId,
    String name,
    LocalDateTime startDate,
    LocalDateTime endDate,
    PromotionCampaignType promotionCampaignType,
    PromotionStatus status,
    Integer discountPercent,
    Integer maxQuantity,
    Integer soldQuantity,
    Integer reservedQuantity
) {}