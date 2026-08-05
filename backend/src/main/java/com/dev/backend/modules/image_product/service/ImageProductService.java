package com.dev.backend.modules.image_product.service;

import java.util.List;

import com.dev.backend.modules.cloudinary.dto.ImageResponse;
import com.dev.backend.modules.image_product.dto.ImageProductResponse;
import com.dev.backend.modules.product.entity.Product;

public interface ImageProductService {
    
    String getDefaultImageUrlByProductId(Long productId);

    void setImagesProduct(Product product, List<ImageResponse> imageResponses);

    List<ImageProductResponse> getImageResponsesByProductId(Long productId);

    void deleteImagesByProductId(Long productId);
}
