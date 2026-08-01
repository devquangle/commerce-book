package com.dev.backend.modules.promotion_product.service;

import com.dev.backend.modules.promotion_product.entity.PromotionProduct;

import java.util.List;

public interface PromotionProductService {
    List<PromotionProduct> getAllPromotionProducts();
    PromotionProduct getPromotionProductById(Long id);
    List<PromotionProduct> getPromotionProductsByPromotionId(Long promotionId);
    List<PromotionProduct> getPromotionProductsByProductId(Long productId);
    PromotionProduct createPromotionProduct(PromotionProduct promotionProduct);
    void deletePromotionProduct(Long id);
}
