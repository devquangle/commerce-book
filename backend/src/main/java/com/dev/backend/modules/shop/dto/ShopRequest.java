package com.dev.backend.modules.shop.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ShopRequest {
    private Long ownerId;
    private String name;
    private String description;
    private String logoUrl;
    private String status;
    private Double rating;
}
