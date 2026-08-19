package com.dev.backend.modules.promotion.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductPromotion {
    private Long productId;
    private Integer discountPercent;
    private Integer maxQuantity;
}
