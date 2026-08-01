package com.dev.backend.modules.image_product.service.impl;

import com.dev.backend.modules.image_product.entity.ImageProduct;
import com.dev.backend.modules.image_product.repository.ImageProductRepository;
import com.dev.backend.modules.image_product.service.ImageProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ImageProductServiceImpl implements ImageProductService {

    private final ImageProductRepository imageProductRepository;

    @Override
    @Transactional(readOnly = true)
    public List<ImageProduct> getAllImageProducts() {
        return imageProductRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public ImageProduct getImageProductById(Long id) {
        return imageProductRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ImageProduct not found with id: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ImageProduct> getImageProductsByProductId(Long productId) {
        return imageProductRepository.findByProductId(productId);
    }

    @Override
    public ImageProduct createImageProduct(ImageProduct imageProduct) {
        return imageProductRepository.save(imageProduct);
    }

    @Override
    public void deleteImageProduct(Long id) {
        if (!imageProductRepository.existsById(id)) {
            throw new RuntimeException("ImageProduct not found with id: " + id);
        }
        imageProductRepository.deleteById(id);
    }
}
