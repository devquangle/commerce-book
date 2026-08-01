package com.dev.backend.modules.address.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AddressResponse {
    private Long id;
    private Long userId;
    private Integer provinceId;
    private Integer districtId;
    private String wardCode;
    private String street;
    private String streetFull;
    private boolean isDefault;
    private boolean isShop;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
