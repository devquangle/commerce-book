package com.dev.backend.modules.promotion.service;

import com.dev.backend.modules.promotion.dto.PromotionRequest;
import com.dev.backend.modules.promotion.dto.PromotionResponse;

import java.util.List;

public interface PromotionService {
    List<PromotionResponse> getAllPromotions();
    PromotionResponse getPromotionById(Long id);
    List<PromotionResponse> getPromotionsByShopId(Long shopId);
    PromotionResponse createPromotion(PromotionRequest request);
    PromotionResponse updatePromotion(Long id, PromotionRequest request);
    void deletePromotion(Long id);
}
