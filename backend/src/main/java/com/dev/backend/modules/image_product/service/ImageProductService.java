package com.dev.backend.modules.image_product.service;

import com.dev.backend.modules.image_product.entity.ImageProduct;

import java.util.List;

public interface ImageProductService {
    List<ImageProduct> getAllImageProducts();
    ImageProduct getImageProductById(Long id);
    List<ImageProduct> getImageProductsByProductId(Long productId);
    ImageProduct createImageProduct(ImageProduct imageProduct);
    void deleteImageProduct(Long id);
}
