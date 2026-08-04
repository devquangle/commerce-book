package com.dev.backend.modules.product.dto;

import com.dev.backend.common.enums.ProductStatus;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductFilterRequest {
    private String keyword;
    private ProductStatus status;
    private Integer page;
    private Integer size;
}
