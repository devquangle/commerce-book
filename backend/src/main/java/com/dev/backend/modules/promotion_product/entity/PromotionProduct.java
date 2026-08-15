package com.dev.backend.modules.promotion_product.entity;

import com.dev.backend.common.entity.BaseEntity;
import com.dev.backend.modules.product.entity.Product;
import com.dev.backend.modules.promotion.entity.Promotion;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "promotion_products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PromotionProduct extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "promotion_id", nullable = false)
    private Promotion promotion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(name = "discount_percent")
    private Integer discountPercent; // 1-10

    @Column(name = "max_quantity")
    private Integer maxQuantity;

    @Column(name = "sold_quantity")
    private Integer soldQuantity;

    @Column(name = "reserved_quantity")
    private Integer reservedQuantity;
}
