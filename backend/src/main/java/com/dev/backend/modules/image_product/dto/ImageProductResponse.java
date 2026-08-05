package com.dev.backend.modules.image_product.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ImageProductResponse {
    private String url;
    private boolean isThumbnail;
}
