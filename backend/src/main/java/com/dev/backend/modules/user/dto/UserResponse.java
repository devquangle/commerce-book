package com.dev.backend.modules.user.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;



import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponse {
    private Long id;
    private String username;
    private String email;
    private String name;
    private String phone;
    private String street;
    private String role;
    private String avatarUrl;
    private String identityNumber;
    private LocalDate dateOfBirth;
    private String gender;
    private String nationality;
    private LocalDate expiryDate;
}
