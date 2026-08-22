package com.dev.backend.modules.publisher.dto;

public record PublisherProductResponse(
                Long id,
                String name,
                String slug) {
        public PublisherProductResponse {
                if (name == null || name.isBlank() || name.equals("khác")) {
                        name = "Chưa có thông tin";
                }

        }
}