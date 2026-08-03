package com.dev.backend.modules.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserRequest {

    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không hợp lệ")
    @Size(max = 100, message = "Email không được vượt quá 100 ký tự")
    private String email;

    @NotBlank(message = "Họ và tên không được để trống")
    @Size(min = 2, max = 100, message = "Họ và tên phải từ 2 đến 100 ký tự")
    @Pattern(
        regexp = "^[A-Za-zÀ-ỹ]+(?:\\s[A-Za-zÀ-ỹ]+)*$",
        message = "Họ và tên chỉ được chứa chữ cái và khoảng trắng"
    )
    private String name;

    @NotBlank(message = "Số điện thoại không được để trống")
    @Pattern(
        regexp = "^(0|\\+84)[3-9][0-9]{8}$",
        message = "Số điện thoại không hợp lệ"
    )
    private String phone;

    @NotBlank(message = "Địa chỉ không được để trống")
    @Size(max = 255, message = "Địa chỉ không được vượt quá 255 ký tự")
    private String street;

    private String avatarUrl;
}