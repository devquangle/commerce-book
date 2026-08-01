package com.dev.backend.modules.shop.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShopRequest {
    private Long ownerId;
    private String name;
    private String description;
    private String logoUrl;
    private String status;
    private Double rating;
}
