package com.dev.backend.modules.promotion.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

import com.dev.backend.common.enums.PromotionCampaignType;
import com.dev.backend.common.enums.PromotionStatus;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PromotionRequest {
    private String name;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private PromotionCampaignType promotionCampaignType;
    private PromotionStatus status;
    private List<ProductPromotion> products;
}
