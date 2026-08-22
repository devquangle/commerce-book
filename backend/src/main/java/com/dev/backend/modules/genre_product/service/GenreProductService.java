package com.dev.backend.modules.genre_product.service;

import java.util.List;
import java.util.Map;

import com.dev.backend.modules.genre_product.dto.GenreProductResponse;
import com.dev.backend.modules.product.entity.Product;

public interface GenreProductService {
    List<String> getGenreNamesByProductId(Long productId);

    Map<Long, List<String>> findGenreMap(List<Long> productIds);

    List<Long> getGenreIdsByProductId(Long productId);

    void setGenresProduct(Product product, List<Long> genreIds);

    List<GenreProductResponse> getGenresWithProducts();

    List<GenreProductResponse> getGenresByProductId(Long productId);
}
