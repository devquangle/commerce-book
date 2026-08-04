package com.dev.backend.modules.genre_product.service;



import java.util.List;

public interface GenreProductService {
    List<String> getGenreNamesByProductId(Long productId);
}
