package com.dev.backend.modules.product.dto.response;

import java.util.List;

import com.dev.backend.common.enums.ProductStatus;
import com.dev.backend.modules.image_product.dto.ImageProductResponse;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductDetailResponse {
    private Long productId;
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
    
    private String description;
    
    private Long publisherId;
    private Long seriesId;

    private List<Long> genreIds;
    private List<Long> authorIds;
    private List<ImageProductResponse> coverImages;
    private String reason;
    private ProductStatus status;
}
