package com.dev.backend.modules.series.dto;

public record SeriesProductResponse(
                Long id,
                String name,
                String slug,
                Long bookCount) {
}