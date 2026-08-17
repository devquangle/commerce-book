package com.dev.backend.modules.author_product.dto;

public record AuthorProductResponse(
        Integer id,
        String name,
        String slug,
        Long bookCount) {
}
