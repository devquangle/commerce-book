package com.dev.backend.modules.series.dto;

public record SeriesProductResponse(
        Long id,
        String name,
        String slug) {
    public SeriesProductResponse {
        if (name == null || name.isBlank() || name.equals("khác")) {
            name = "Chưa có thông tin";
        }
    }
}