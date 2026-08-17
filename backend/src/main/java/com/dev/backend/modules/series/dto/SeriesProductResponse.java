package com.dev.backend.modules.series.dto;

public record SeriesProductResponse(
        Integer Id,
        String name,
        String slug,
        Long bookCount) {
}