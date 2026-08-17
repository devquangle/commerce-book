package com.dev.backend.modules.publisher.dto;

public record PublisherProductResponse(
        Integer id,
        String name,
        String slug,
        Long bookCount) {
}