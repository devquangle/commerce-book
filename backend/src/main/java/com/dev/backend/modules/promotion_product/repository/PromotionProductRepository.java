package com.dev.backend.modules.promotion_product.repository;

import com.dev.backend.modules.promotion_product.entity.PromotionProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PromotionProductRepository extends JpaRepository<PromotionProduct, Long> {
    List<PromotionProduct> findByPromotionId(Long promotionId);
    List<PromotionProduct> findByProductId(Long productId);
}
