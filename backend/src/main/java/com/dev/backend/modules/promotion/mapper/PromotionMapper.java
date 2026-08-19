package com.dev.backend.modules.promotion.mapper;

import com.dev.backend.modules.promotion.dto.PromotionRequest;
import com.dev.backend.modules.promotion.dto.PromotionResponse;
import com.dev.backend.modules.promotion.entity.Promotion;
import org.springframework.stereotype.Component;

@Component
public class PromotionMapper {

    public Promotion toEntity(PromotionRequest request) {
        if (request == null) {
            return null;
        }
        return null;
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
