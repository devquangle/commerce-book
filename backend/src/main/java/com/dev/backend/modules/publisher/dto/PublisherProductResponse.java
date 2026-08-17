package com.dev.backend.modules.publisher.dto;

public record PublisherProductResponse(
        Integer Id,
        String name,
        String slug,
        Long bookCount) {
}