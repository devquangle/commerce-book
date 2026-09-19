package com.dev.backend.modules.shop.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor 
@NoArgsConstructor 
@Getter 
@Setter 
public class RegisterShopRequest {
    private String email;
    private String phone;
    private String password;
    private String confirmPassword;

    private String fullName;
    private String identityNumber;
    private String dateOfBirth;
    private String gender;
    private String nationality;
    private String address;
    private String expiryDate;

    private String shopName;
    private String shopDescription;
    private String logo;
    private String banner;
    private String bankName;
    private String bankNumber;
    private String ownerName;

    private Integer provinceId;
    private Integer districtId;
    private String wardCode;
    private String street;
}
