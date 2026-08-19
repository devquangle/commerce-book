package com.dev.backend.modules.promotion_product.dto;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductPromotionRequest {

    private List<Long> productIds;
}