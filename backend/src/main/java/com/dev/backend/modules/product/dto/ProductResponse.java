package com.dev.backend.modules.product.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

import com.dev.backend.common.enums.ProductStatus;
import com.dev.backend.modules.shop.dto.ShopSimpleResponse;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductResponse {
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
    private String reason;
    private List<String> genresName;
    private List<String> authorsName;
    private String urlImageDefault;

    private ShopSimpleResponse shop;

    private ProductStatus status;
}
