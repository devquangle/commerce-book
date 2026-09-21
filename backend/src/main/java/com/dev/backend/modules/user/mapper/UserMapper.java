package com.dev.backend.modules.user.mapper;

import com.dev.backend.modules.shop.dto.RegisterShopRequest;
import com.dev.backend.modules.user.dto.UserRequest;
import com.dev.backend.modules.user.dto.UserResponse;
import com.dev.backend.modules.user.entity.User;

import java.time.LocalDate;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public UserResponse toResponse(User entity) {
        if (entity == null) {
            return null;
        }
        return UserResponse.builder()
                .id(entity.getId())
                .username(entity.getUsername())
                .email(entity.getEmail())
                .name(entity.getFullName())
                .phone(entity.getPhone())
                .avatarUrl(entity.getAvatarUrl())
                .street(entity.getStreet())
                .role(entity.getRole() != null ? entity.getRole().getName() : null)
                .identityNumber(entity.getIdentityNumber())
                .dateOfBirth(entity.getDateOfBirth())
                .gender(entity.getGender())
                .nationality(entity.getNationality())
                .expiryDate(entity.getExpiryDate())
                .build();
    }

    public User toProfile(User entity, UserRequest request) {
        if (entity == null || request == null) {
            return null;
        }
        entity.setFullName(request.getName());
        entity.setEmail(request.getEmail());
        entity.setPhone(request.getPhone());
        entity.setStreet(request.getStreet());
        entity.setAvatarUrl(request.getAvatarUrl());
        return entity;
    }

    public User toAccount(RegisterShopRequest request) {
        if (request == null) {
            return null;
        }
        User entity= new User();
        entity.setFullName(request.fullName());
        entity.setEmail(request.email());
        entity.setPhone(request.phone());
        entity.setPassword(null);
        entity.setIdentityNumber(request.identityNumber());
        entity.setDateOfBirth(request.dateOfBirth());
        entity.setGender(request.gender());
        entity.setNationality(request.nationality());
        entity.setStreet(request.address());
        entity.setExpiryDate(request.expiryDate());
        return entity;
    }

}
