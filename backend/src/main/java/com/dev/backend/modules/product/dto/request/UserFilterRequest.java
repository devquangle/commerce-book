package com.dev.backend.modules.product.dto.request;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserFilterRequest {
    private String keyword;

    private List<String> genres;

    private List<String> authors;

    private String publisher;

    private String series;

    private Integer minPrice = 0;

    private Integer maxPrice= 1000000000;

    private Double rating;

    private Integer page;
    private Integer size;
    private String sort;
}
