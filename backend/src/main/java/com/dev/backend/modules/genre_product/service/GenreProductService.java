package com.dev.backend.modules.genre_product.service;

import java.util.List;

import com.dev.backend.modules.product.entity.Product;

public interface GenreProductService {
    List<String> getGenreNamesByProductId(Long productId);

    void setGenresProduct(Product product, List<Long> genreIds);
}
