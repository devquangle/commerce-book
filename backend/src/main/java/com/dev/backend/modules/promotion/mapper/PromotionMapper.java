package com.dev.backend.modules.promotion.mapper;

import com.dev.backend.common.utils.TextUtils;
import com.dev.backend.modules.promotion.dto.PromotionRequest;
import com.dev.backend.modules.promotion.dto.PromotionResponse;
import com.dev.backend.modules.promotion.entity.Promotion;
import org.springframework.stereotype.Component;

@Component
public class PromotionMapper {

    public Promotion toEntity(Promotion promotion,PromotionRequest request) {
        if (request == null) {
            return null;
        }
        promotion.setName(TextUtils.capitalizeFully(request.getName()));
        promotion.setStartDate(request.getStartDate());
        promotion.setEndDate(request.getEndDate());
        promotion.setPromotionCampaignType(request.getPromotionCampaignType());
        return promotion;
    }

    public PromotionResponse toDTO(Promotion entity) {
        if (entity == null) {
            return null;
        }
        PromotionResponse response = new PromotionResponse();
        response.setId(entity.getId());
        response.setName(entity.getName());
        response.setStartDate(entity.getStartDate());
        response.setEndDate(entity.getEndDate());
        response.setPromotionCampaignType(entity.getPromotionCampaignType());
        response.setStatus(entity.getStatus());
        return response;
    }

}
