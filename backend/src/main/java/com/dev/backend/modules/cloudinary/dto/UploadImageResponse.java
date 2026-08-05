package com.dev.backend.modules.cloudinary.dto;

public record UploadImageResponse(
        String url,
        String publicId) {

}