package com.dev.backend.modules.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterUserRequest(
        @NotBlank(message = "Email không được để trống") 
        @Email(message = "Email không hợp lệ") 
        String email,
        @NotBlank(message = "Mật khẩu không được để trống") 
        @Size(min = 8, message = "Mật khẩu phải có ít nhất 6 ký tự") 
        String password,
        @NotBlank(message = "Vui lòng xác nhận mật khẩu") 
        String confirmPassword
) {}