package com.dev.backend.modules.cloudinary.dto;

public record ImageResponse(
        String url,
        boolean isThumbnail) {
}
