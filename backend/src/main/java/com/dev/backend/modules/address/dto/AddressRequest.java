package com.dev.backend.modules.address.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record AddressRequest(
        @NotBlank(message = "Họ tên không được để trống") @Size(max = 100, message = "Họ tên không được vượt quá 100 ký tự") String fullName,

        @NotBlank(message = "Số điện thoại không được để trống") @Pattern(regexp = "^(0|\\+84)(3|5|7|8|9)[0-9]{8}$", message = "Số điện thoại không hợp lệ") String phone,
        @NotNull(message = "Tỉnh/thành phố không được để trống") @Positive(message = "Province ID phải lớn hơn 0") Integer provinceId,

        @NotNull(message = "Quận/huyện không được để trống") @Positive(message = "District ID phải lớn hơn 0") Integer districtId,

        @NotBlank(message = "Mã phường/xã không được để trống") String wardCode,

        @NotBlank(message = "Địa chỉ không được để trống") String street,

        boolean defaultAddress
) {
}