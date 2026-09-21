package com.dev.backend.modules.shop.mapper;

import com.dev.backend.common.enums.ShopStatus;
import com.dev.backend.modules.shop.dto.RegisterShopRequest;
import com.dev.backend.modules.shop.entity.Shop;
import com.dev.backend.modules.user.entity.User;

import com.dev.backend.common.utils.TextUtils;
import org.springframework.stereotype.Component;

import com.dev.backend.modules.address.entity.Address;
import com.dev.backend.modules.shop.dto.AdminShopDetailResponse;
import com.dev.backend.modules.shop.dto.AdminShopResponse;
import com.dev.backend.modules.shop.dto.ShopResponse;

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
        entity.setName(request.shopName() != null ? TextUtils.capitalizeFully(request.shopName().trim()) : null);
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

    public AdminShopResponse toAdminResponse(Shop entity) {
        if (entity == null) {
            return null;
        }
        User owner = entity.getOwner();
        AdminShopResponse dto = new AdminShopResponse();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setSlug(entity.getSlug());
        dto.setDescription(entity.getDescription());
        dto.setLogoUrl(entity.getLogoUrl());
        dto.setBannerUrl(entity.getBannerUrl());
        dto.setStatus(entity.getStatus());
        dto.setReason(entity.getReason());
        dto.setRating(entity.getRating());
        dto.setYear(entity.getYear());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());
        dto.setOwnerId(owner != null ? owner.getId() : null);
        dto.setOwnerFullName(owner != null ? owner.getFullName() : null);
        dto.setOwnerEmail(owner != null ? owner.getEmail() : null);
        dto.setOwnerPhone(owner != null ? owner.getPhone() : null);
        dto.setBankName(entity.getBankName());
        dto.setBankNumber(entity.getBankNumber());
        dto.setOwnerName(entity.getOwnerName());
        return dto;
    }

    public AdminShopDetailResponse toAdminDetailResponse(Shop entity, Address address) {
        if (entity == null) {
            return null;
        }
        User owner = entity.getOwner();
        String roleName = null;
        if (owner != null && owner.getRole() != null) {
            roleName = owner.getRole().getName() != null ? owner.getRole().getName() : owner.getRole().getCode();
        }

        AdminShopDetailResponse dto = new AdminShopDetailResponse();
        // Shop Profile
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setSlug(entity.getSlug());
        dto.setDescription(entity.getDescription());
        dto.setLogoUrl(entity.getLogoUrl());
        dto.setBannerUrl(entity.getBannerUrl());
        dto.setStatus(entity.getStatus());
        dto.setReason(entity.getReason());
        dto.setRating(entity.getRating());
        dto.setYear(entity.getYear());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());
        // Owner
        dto.setOwnerId(owner != null ? owner.getId() : null);
        dto.setUsername(owner != null ? owner.getUsername() : null);
        dto.setEmail(owner != null ? owner.getEmail() : null);
        dto.setPhone(owner != null ? owner.getPhone() : null);
        dto.setFullName(owner != null ? owner.getFullName() : null);
        dto.setOwnerFullName(owner != null ? owner.getFullName() : null);
        dto.setOwnerRole(roleName);
        // eKYC
        dto.setIdentityNumber(owner != null ? owner.getIdentityNumber() : null);
        dto.setDateOfBirth(owner != null ? owner.getDateOfBirth() : null);
        dto.setGender(owner != null ? owner.getGender() : null);
        dto.setNationality(owner != null ? owner.getNationality() : null);
        dto.setPermanentAddress(owner != null ? owner.getStreet() : null);
        dto.setExpiryDate(owner != null ? owner.getExpiryDate() : null);
        dto.setCccdFrontUrl(owner != null ? owner.getCccdFrontUrl() : null);
        dto.setCccdBackUrl(owner != null ? owner.getCccdBackUrl() : null);
        dto.setFaceImageUrl(owner != null ? owner.getFaceImageUrl() : null);
        dto.setEkycVerified(owner != null ? owner.getEkycVerified() : false);
        // Banking
        dto.setBankName(entity.getBankName());
        dto.setBankNumber(entity.getBankNumber());
        dto.setOwnerName(entity.getOwnerName());
        // Warehouse Address
        dto.setWarehouseAddressId(address != null ? address.getId() : null);
        dto.setStreetFull(address != null ? address.getStreetFull() : null);
        dto.setStreet(address != null ? address.getStreet() : null);
        dto.setProvinceId(address != null ? address.getProvinceId() : null);
        dto.setDistrictId(address != null ? address.getDistrictId() : null);
        dto.setWardCode(address != null ? address.getWardCode() : null);
        return dto;
    }
}
