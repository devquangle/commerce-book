package com.dev.backend.modules.product.dto;

import java.util.List;

import com.dev.backend.common.enums.ProductStatus;

import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
public class ProductInfo {
    private Integer productId;
    private String name;
    private String slug;
    private Integer originalPrice;
    private Integer price;
    private Integer quantity;
    private Integer weight;
    private String publishYear;
    private Integer pages;
    private String language;
    private String isbn;

    private String publisherName;
    private String seriesName;
    
    private List<String> genresName;
    private List<String> authorsName;
    private String urlImageDefault;

    private ProductStatus status;
}
