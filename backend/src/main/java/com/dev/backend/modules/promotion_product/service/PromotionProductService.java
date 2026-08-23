package com.dev.backend.modules.promotion_product.service;

import com.dev.backend.modules.cart.entity.CartItem;
import com.dev.backend.modules.order.entity.OrderItem;
import com.dev.backend.modules.promotion.dto.ProductPromotion;
import com.dev.backend.modules.promotion.entity.Promotion;
import com.dev.backend.modules.promotion_product.dto.ProductPromotionResponse;

import java.util.List;

public interface PromotionProductService {
    List<ProductPromotionResponse> getByProductIds(List<Long> productIds);

    void setPromotionProducts(Promotion promotion, List<ProductPromotion> items);

    Integer getCurrentDiscountPercent(Long productId);

    // void reservePromotions(List<CartItem> cartItems);

    // void releasePromotions(List<OrderItem> orderItems);
}
