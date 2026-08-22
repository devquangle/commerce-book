package com.dev.backend.modules.genre_product.dto;

public record GenreProductResponse(
                Long id,
                String name,
                String slug) {
        public GenreProductResponse {
                if (name == null || name.isBlank() || name.equals("khác")) {
                        name = "Chưa có thông tin";
                }

        }
}