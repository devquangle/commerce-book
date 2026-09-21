package com.dev.backend.modules.shop.dto;

import com.dev.backend.common.enums.ShopStatus;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class AdminShopDetailResponse {
    // Shop Profile
    private Long id;
    private String name;
    private String slug;
    private String description;
    private String logoUrl;
    private String bannerUrl;
    private ShopStatus status;
    private String reason;
    private Double rating;
    private int year;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Owner Identity & Contact
    private Long ownerId;
    private String username;
    private String email;
    private String phone;
    private String fullName;
    private String ownerFullName;
    private String ownerRole;

    // eKYC Data
    private String identityNumber;
    private LocalDate dateOfBirth;
    private String gender;
    private String nationality;
    private String permanentAddress;
    private LocalDate expiryDate;
    private String cccdFrontUrl;
    private String cccdBackUrl;
    private String faceImageUrl;
    private Boolean ekycVerified;

    // Banking Data
    private String bankName;
    private String bankNumber;
    private String ownerName;

    // Warehouse / Pickup Address
    private Long warehouseAddressId;
    private String streetFull;
    private String street;
    private Integer provinceId;
    private Integer districtId;
    private String wardCode;
}
