package com.dev.backend.modules.shop.mapper;

import com.dev.backend.common.enums.ShopStatus;
import com.dev.backend.modules.shop.dto.RegisterShopRequest;
import com.dev.backend.modules.shop.dto.ShopResponse;
import com.dev.backend.modules.shop.entity.Shop;
import com.dev.backend.modules.user.entity.User;

import com.dev.backend.common.utils.TextUtils;
import org.springframework.stereotype.Component;

@Component
public class ShopMapper {

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

    public Shop toShop(User user, RegisterShopRequest request) {
        if (request == null) {
            return null;
        }

        Shop entity = new Shop();
        entity.setName(request.shopName() != null ? request.shopName().trim() : null);
        entity.setSlug(request.shopName() != null ? TextUtils.toSlug(request.shopName()) : null);
        entity.setDescription(request.shopDescription());
        entity.setLogoUrl(request.logo());
        entity.setBannerUrl(request.banner());
        entity.setBankName(request.bankName());
        entity.setBankNumber(request.bankNumber());
        entity.setOwnerName(request.ownerName());
        entity.setStatus(ShopStatus.PENDING);
        entity.setOwner(user);
        return entity;
    }
}
