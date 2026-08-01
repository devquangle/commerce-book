package com.dev.backend.modules.product.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductRequest {
    private Long shopId;
    private Long publisherId;
    private Long seriesId;
    private String title;
    private String slug;
    private String isbn;
    private String description;
    private BigDecimal price;
    private BigDecimal originalPrice;
    private Integer stockQuantity;
    private String status;
    private List<Long> authorIds;
    private List<Long> genreIds;
}
