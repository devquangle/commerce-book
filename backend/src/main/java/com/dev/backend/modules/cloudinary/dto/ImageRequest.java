package com.dev.backend.modules.cloudinary.dto;

import org.springframework.web.multipart.MultipartFile;

public record ImageRequest(
        MultipartFile file,
        String url,
        boolean isThumbnail) {
}
