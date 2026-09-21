package com.dev.backend.modules.shop.dto;

import com.dev.backend.common.enums.ShopStatus;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class AdminShopResponse {
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

    // Owner info
    private Long ownerId;
    private String ownerFullName;
    private String ownerEmail;
    private String ownerPhone;

    // Banking info
    private String bankName;
    private String bankNumber;
    private String ownerName;
}
