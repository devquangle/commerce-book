package com.dev.backend.modules.user.dto;

import org.aspectj.weaver.ast.Not;

import jakarta.validation.constraints.NotBlank;
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
public class UserRequest {
    @NotBlank(message="Email không được bỏ trống.")
    private String email;
    private String name;
    private String phone;
    private String street;
    private String avatarUrl;
}
