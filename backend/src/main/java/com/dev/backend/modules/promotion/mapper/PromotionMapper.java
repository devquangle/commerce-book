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

    public PromotionResponse toResponse(Promotion entity) {
        if (entity == null) {
            return null;
        }
        return null;
    }

    public void updateEntityFromRequest(PromotionRequest request, Promotion entity) {
    }
}
