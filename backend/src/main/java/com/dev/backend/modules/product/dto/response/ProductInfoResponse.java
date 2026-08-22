package com.dev.backend.modules.product.dto.response;

import com.dev.backend.common.enums.ProductStatus;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductInfoResponse {
    private Long productId;
    private String productName;
    private String productSlug;
    private Integer originalPrice;
    private Integer price;
    private Integer quantity;
    private String reason;
    private String urlImageDefault;
    private ProductStatus status;
}
