package com.dev.backend.modules.address.dto;

public record AddressResponse(
        Long id,
        String fullName,
        String phone,
        Integer provinceId,
        Integer districtId,
        String wardCode,
        String street,
        String streetFull,
        boolean defaultAddress,
        boolean shopAddress
) {}
