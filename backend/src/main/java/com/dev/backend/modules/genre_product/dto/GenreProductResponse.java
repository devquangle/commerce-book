package com.dev.backend.modules.genre_product.dto;

public record GenreProductResponse(
        Integer Id,
        String name,
        String slug,
        Long bookCount) {
}