package com.dev.backend.modules.promotion.entity;

import com.dev.backend.common.entity.BaseEntity;
import com.dev.backend.common.enums.PromotionCampaignType;
import com.dev.backend.common.enums.PromotionStatus;
import com.dev.backend.modules.promotion_product.entity.PromotionProduct;
import com.dev.backend.modules.shop.entity.Shop;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "promotions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Promotion extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shop_id")
    private Shop shop;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "start_date")
    private LocalDateTime startDate;

    @Column(name = "end_date")
    private LocalDateTime endDate;

    @Enumerated(EnumType.STRING)
    private PromotionCampaignType promotionCampaignType;

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private PromotionStatus status;

    @OneToMany(mappedBy = "promotion", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PromotionProduct> promotionProducts = new ArrayList<>();
}
