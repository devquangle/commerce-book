package com.dev.backend.modules.genre_product.dto;

public record GenreProductResponse(
        Long id,
        String name,
        String slug,
        Long bookCount) {
}