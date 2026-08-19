package com.dev.backend.modules.promotion_product.service;

import com.dev.backend.modules.promotion_product.dto.ProductPromotionResponse;

import java.util.List;

public interface PromotionProductService {
    List<ProductPromotionResponse> getByProductIds(List<Long> productIds);
}
