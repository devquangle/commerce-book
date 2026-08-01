package com.dev.backend.modules.genre_product.service;

import com.dev.backend.modules.genre_product.entity.GenreProduct;

import java.util.List;

public interface GenreProductService {
    List<GenreProduct> getAllGenreProducts();
    GenreProduct getGenreProductById(Long id);
    List<GenreProduct> getGenreProductsByProductId(Long productId);
    List<GenreProduct> getGenreProductsByGenreId(Long genreId);
    GenreProduct createGenreProduct(GenreProduct genreProduct);
    void deleteGenreProduct(Long id);
}
