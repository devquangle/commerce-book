package com.dev.backend.modules.product.dto.response;

import java.util.List;

import com.dev.backend.common.enums.ProductStatus;
import com.dev.backend.modules.author_product.dto.AuthorProductResponse;
import com.dev.backend.modules.genre_product.dto.GenreProductResponse;
import com.dev.backend.modules.image_product.dto.ImageProductResponse;
import com.dev.backend.modules.publisher.dto.PublisherProductResponse;
import com.dev.backend.modules.series.dto.SeriesProductResponse;

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
    private String description;

    private ProductStatus status;

    private List<AuthorProductResponse> productAuthors;
    private List<GenreProductResponse> productGenres;
    private PublisherProductResponse productPublisher;
    private SeriesProductResponse productSeries;
    private List<ImageProductResponse> coverImages;
    private Integer discountPercent;

}
