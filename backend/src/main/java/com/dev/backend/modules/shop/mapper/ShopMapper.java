package com.dev.backend.modules.shop.mapper;

import com.dev.backend.modules.shop.dto.ShopRequest;
import com.dev.backend.modules.shop.dto.ShopResponse;
import com.dev.backend.modules.shop.entity.Shop;
import org.springframework.stereotype.Component;

@Component
public class ShopMapper {

    public Shop toEntity(ShopRequest request) {
        if (request == null) {
            return null;
        }
        return Shop.builder()
                .name(request.getName())
                .description(request.getDescription())
                .logoUrl(request.getLogoUrl())
                .status(request.getStatus())
                .rating(request.getRating())
                .build();
    }

    public ShopResponse toResponse(Shop entity) {
        if (entity == null) {
            return null;
        }
        return ShopResponse.builder()
                .id(entity.getId())
                .ownerId(entity.getOwner() != null ? entity.getOwner().getId() : null)
                .name(entity.getName())
                .description(entity.getDescription())
                .logoUrl(entity.getLogoUrl())
                .status(entity.getStatus())
                .rating(entity.getRating())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    public void updateEntityFromRequest(ShopRequest request, Shop entity) {
        if (request == null || entity == null) {
            return;
        }
        if (request.getName() != null) {
            entity.setName(request.getName());
        }
        if (request.getDescription() != null) {
            entity.setDescription(request.getDescription());
        }
        if (request.getLogoUrl() != null) {
            entity.setLogoUrl(request.getLogoUrl());
        }
        if (request.getStatus() != null) {
            entity.setStatus(request.getStatus());
        }
        if (request.getRating() != null) {
            entity.setRating(request.getRating());
        }
    }
}
