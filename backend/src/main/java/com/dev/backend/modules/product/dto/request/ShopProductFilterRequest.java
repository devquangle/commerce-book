package com.dev.backend.modules.product.dto.request;

import com.dev.backend.common.enums.ProductStatus;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ShopProductFilterRequest {
    private String keyword;
    private ProductStatus status;
    private Integer page;
    private Integer size;
}
