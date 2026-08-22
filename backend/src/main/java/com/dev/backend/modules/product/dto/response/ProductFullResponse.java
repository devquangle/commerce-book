package com.dev.backend.modules.product.dto.response;

import com.dev.backend.common.enums.ProductStatus;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductFullResponse {
    private Long productId;
    private String productName;
    private String productSlug;

    private Integer originalPrice;
    private Integer price;
    private Integer quantity;

    private Integer weight;
    private String publishYear;
    private Integer pages;
    private String language;
    private String isbn;
    
    private ProductStatus status;

}
