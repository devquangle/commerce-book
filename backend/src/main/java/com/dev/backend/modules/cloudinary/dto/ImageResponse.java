package com.dev.backend.modules.cloudinary.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ImageResponse {
        private String url;
        private String publicId;
        private boolean isThumbnail;
}
