package com.dev.backend.modules.author_product.dto;

public record AuthorProductResponse(
                Long id,
                String name,
                String slug

) {
        public AuthorProductResponse {
                if (name == null || name.isBlank() || name.equals("khác")) {
                        name = "Chưa có thông tin";
                }

        }
}
