package com.dev.backend.modules.shop.dto;

import com.dev.backend.common.enums.ShopStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShopResponse {
    private Long id;
    private Long ownerId;
    private String name;
    private String description;
    private String logoUrl;
    private ShopStatus status;
    private Double rating;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
