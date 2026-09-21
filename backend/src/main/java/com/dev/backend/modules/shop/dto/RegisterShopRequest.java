package com.dev.backend.modules.shop.dto;

import java.time.LocalDate;


public record RegisterShopRequest(
        String email,
        String phone,
        String password,
        String confirmPassword,

        String fullName,
        String identityNumber,
        LocalDate dateOfBirth,
        String gender,
        String nationality,
        String address,
        LocalDate expiryDate,

        String shopName,
        String shopDescription,
        String logo,
        String banner,
        String bankName,
        String bankNumber,
        String ownerName,

        Integer provinceId,
        Integer districtId,
        String wardCode,
        String street
) {}