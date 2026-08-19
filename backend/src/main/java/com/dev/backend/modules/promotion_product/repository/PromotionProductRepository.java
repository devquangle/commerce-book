package com.dev.backend.modules.promotion_product.repository;

import com.dev.backend.modules.promotion_product.dto.ProductPromotionProjection;
import com.dev.backend.modules.promotion_product.entity.PromotionProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PromotionProductRepository extends JpaRepository<PromotionProduct, Long> {
    @Query("""
                SELECT new com.dev.backend.modules.promotion_product.dto.ProductPromotionProjection(
                    pp.product.id,
                    p.id,
                    p.name,
                    p.startDate,
                    p.endDate,
                    p.promotionCampaignType,
                    p.status,
                    pp.discountPercent,
                    pp.maxQuantity,
                    pp.soldQuantity,
                    pp.reservedQuantity
                )
                FROM PromotionProduct pp
                JOIN pp.promotion p
                WHERE pp.product.id IN :productIds
                ORDER BY pp.product.id, p.startDate DESC
            """)
    List<ProductPromotionProjection> findByProductIds(
            @Param("productIds") List<Long> productIds);
}
