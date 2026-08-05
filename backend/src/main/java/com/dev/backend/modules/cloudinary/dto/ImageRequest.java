package com.dev.backend.modules.cloudinary.dto;

import org.springframework.web.multipart.MultipartFile;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ImageRequest {
    private MultipartFile file;
    private String url;
    private boolean isThumbnail;
}
