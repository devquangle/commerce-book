package com.dev.backend.modules.publisher.dto;

public record PublisherProductResponse(
        Long id,
        String name,
        String slug,
        Long bookCount) {
}