package com.dev.backend.modules.product.mapper;

import com.dev.backend.modules.product.dto.ProductRequest;
import com.dev.backend.modules.product.dto.ProductResponse;
import com.dev.backend.modules.product.entity.Product;
import org.springframework.stereotype.Component;

@Component
public class ProductMapper {

    public Product toEntity(ProductRequest request) {
        if (request == null) {
            return null;
        }
        return Product.builder()
                .title(request.getTitle())
                .slug(request.getSlug())
                .isbn(request.getIsbn())
                .description(request.getDescription())
                .price(request.getPrice())
                .originalPrice(request.getOriginalPrice())
                .stockQuantity(request.getStockQuantity())
                .status(request.getStatus())
                .build();
    }

    public ProductResponse toResponse(Product entity) {
        if (entity == null) {
            return null;
        }
        return ProductResponse.builder()
                .id(entity.getId())
                .shopId(entity.getShop() != null ? entity.getShop().getId() : null)
                .publisherId(entity.getPublisher() != null ? entity.getPublisher().getId() : null)
                .seriesId(entity.getSeries() != null ? entity.getSeries().getId() : null)
                .title(entity.getTitle())
                .slug(entity.getSlug())
                .isbn(entity.getIsbn())
                .description(entity.getDescription())
                .price(entity.getPrice())
                .originalPrice(entity.getOriginalPrice())
                .stockQuantity(entity.getStockQuantity())
                .status(entity.getStatus())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    public void updateEntityFromRequest(ProductRequest request, Product entity) {
        if (request == null || entity == null) {
            return;
        }
        if (request.getTitle() != null) {
            entity.setTitle(request.getTitle());
        }
        if (request.getSlug() != null) {
            entity.setSlug(request.getSlug());
        }
        if (request.getIsbn() != null) {
            entity.setIsbn(request.getIsbn());
        }
        if (request.getDescription() != null) {
            entity.setDescription(request.getDescription());
        }
        if (request.getPrice() != null) {
            entity.setPrice(request.getPrice());
        }
        if (request.getOriginalPrice() != null) {
            entity.setOriginalPrice(request.getOriginalPrice());
        }
        if (request.getStockQuantity() != null) {
            entity.setStockQuantity(request.getStockQuantity());
        }
        if (request.getStatus() != null) {
            entity.setStatus(request.getStatus());
        }
    }
}
