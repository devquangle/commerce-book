package com.dev.backend.modules.user.mapper;

import com.dev.backend.modules.user.dto.UserRequest;
import com.dev.backend.modules.user.dto.UserResponse;
import com.dev.backend.modules.user.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public User toEntity(UserRequest request) {
        if (request == null) {
            return null;
        }
        return User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(request.getPassword())
                .fullName(request.getFullName())
                .phone(request.getPhone())
                .avatarUrl(request.getAvatarUrl())
                .street(request.getStreet())
                .status(request.getStatus())
                .build();
    }

    public UserResponse toResponse(User entity) {
        if (entity == null) {
            return null;
        }
        return UserResponse.builder()
                .id(entity.getId())
                .username(entity.getUsername())
                .email(entity.getEmail())
                .fullName(entity.getFullName())
                .phone(entity.getPhone())
                .avatarUrl(entity.getAvatarUrl())
                .street(entity.getStreet())
                .status(entity.getStatus())
                .enabled(entity.isEnabled())
                .accountNonLocked(entity.isAccountNonLocked())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    public void updateEntityFromRequest(UserRequest request, User entity) {
        if (request == null || entity == null) {
            return;
        }
        if (request.getUsername() != null) {
            entity.setUsername(request.getUsername());
        }
        if (request.getEmail() != null) {
            entity.setEmail(request.getEmail());
        }
        if (request.getPassword() != null) {
            entity.setPassword(request.getPassword());
        }
        if (request.getFullName() != null) {
            entity.setFullName(request.getFullName());
        }
        if (request.getPhone() != null) {
            entity.setPhone(request.getPhone());
        }
        if (request.getAvatarUrl() != null) {
            entity.setAvatarUrl(request.getAvatarUrl());
        }
        if (request.getStreet() != null) {
            entity.setStreet(request.getStreet());
        }
        if (request.getStatus() != null) {
            entity.setStatus(request.getStatus());
        }
    }
}
