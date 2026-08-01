package com.dev.backend.modules.address.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AddressRequest {
    private Long userId;
    private Integer provinceId;
    private Integer districtId;
    private String wardCode;
    private String street;
    private String streetFull;
    private Boolean isDefault;
    private Boolean isShop;
}
