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
        return Promotion.builder()
                .code(request.getCode())
                .title(request.getTitle())
                .discountPercent(request.getDiscountPercent())
                .minOrderValue(request.getMinOrderValue())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .usageLimit(request.getUsageLimit())
                .build();
    }

    public PromotionResponse toResponse(Promotion entity) {
        if (entity == null) {
            return null;
        }
        return PromotionResponse.builder()
                .id(entity.getId())
                .shopId(entity.getShop() != null ? entity.getShop().getId() : null)
                .code(entity.getCode())
                .title(entity.getTitle())
                .discountPercent(entity.getDiscountPercent())
                .minOrderValue(entity.getMinOrderValue())
                .startDate(entity.getStartDate())
                .endDate(entity.getEndDate())
                .usageLimit(entity.getUsageLimit())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    public void updateEntityFromRequest(PromotionRequest request, Promotion entity) {
        if (request == null || entity == null) {
            return;
        }
        if (request.getCode() != null) {
            entity.setCode(request.getCode());
        }
        if (request.getTitle() != null) {
            entity.setTitle(request.getTitle());
        }
        if (request.getDiscountPercent() != null) {
            entity.setDiscountPercent(request.getDiscountPercent());
        }
        if (request.getMinOrderValue() != null) {
            entity.setMinOrderValue(request.getMinOrderValue());
        }
        if (request.getStartDate() != null) {
            entity.setStartDate(request.getStartDate());
        }
        if (request.getEndDate() != null) {
            entity.setEndDate(request.getEndDate());
        }
        if (request.getUsageLimit() != null) {
            entity.setUsageLimit(request.getUsageLimit());
        }
    }
}
