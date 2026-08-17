package com.dev.backend.modules.series.dto;

public record SeriesProductResponse(
                Integer id,
                String name,
                String slug,
                Long bookCount) {
}