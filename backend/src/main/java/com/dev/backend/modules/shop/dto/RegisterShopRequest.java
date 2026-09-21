package com.dev.backend.modules.shop.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public record RegisterShopRequest(
        String email,

        @NotBlank(message = "Số điện thoại liên hệ không được để trống")
        @Pattern(regexp = "^(0[3|5|7|8|9])+([0-9]{8})$", message = "Số điện thoại không đúng định dạng (10 chữ số)")
        String phone,

        String password,
        String confirmPassword,

        @NotBlank(message = "Họ và tên chủ sở hữu không được để trống")
        String fullName,

        @NotBlank(message = "Số CCCD / CMND không được để trống")
        @Pattern(regexp = "^[0-9]{9,12}$", message = "Số CCCD/CMND phải gồm 9 đến 12 chữ số")
        String identityNumber,

        @NotNull(message = "Ngày sinh không được để trống")
        @JsonFormat(pattern = "yyyy-MM-dd")
        LocalDate dateOfBirth,

        @NotBlank(message = "Giới tính không được để trống")
        String gender,

        @NotBlank(message = "Quốc tịch không được để trống")
        String nationality,

        @NotBlank(message = "Địa chỉ thường trú không được để trống")
        String address,

        @NotNull(message = "Ngày hết hạn CCCD không được để trống")
        @JsonFormat(pattern = "yyyy-MM-dd")
        LocalDate expiryDate,

        String cccdFrontUrl,
        String cccdBackUrl,
        String faceImageUrl,

        @NotBlank(message = "Tên cửa hàng không được để trống")
        @Size(min = 2, max = 150, message = "Tên cửa hàng phải từ 2 đến 150 ký tự")
        String shopName,

        String shopDescription,
        String logo,
        String banner,

        @NotBlank(message = "Tên ngân hàng thụ hưởng không được để trống")
        String bankName,

        @NotBlank(message = "Số tài khoản ngân hàng không được để trống")
        String bankNumber,

        @NotBlank(message = "Tên chủ tài khoản ngân hàng không được để trống")
        String ownerName,

        @NotNull(message = "Vui lòng chọn Tỉnh / Thành phố")
        @Min(value = 1, message = "Vui lòng chọn Tỉnh / Thành phố")
        Integer provinceId,

        @NotNull(message = "Vui lòng chọn Quận / Huyện")
        @Min(value = 1, message = "Vui lòng chọn Quận / Huyện")
        Integer districtId,

        @NotBlank(message = "Vui lòng chọn Phường / Xã")
        String wardCode,

        @NotBlank(message = "Địa chỉ chi tiết không được để trống")
        String street
) {}