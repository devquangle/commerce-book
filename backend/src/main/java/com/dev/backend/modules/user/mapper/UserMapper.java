package com.dev.backend.modules.user.mapper;

import com.dev.backend.modules.shop.dto.RegisterShopRequest;
import com.dev.backend.modules.user.dto.UserRequest;
import com.dev.backend.modules.user.dto.UserResponse;
import com.dev.backend.modules.user.entity.User;


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
        User entity = new User();
        entity.setFullName(request.fullName());
        entity.setEmail(request.email());
        entity.setPhone(request.phone());
        entity.setIdentityNumber(request.identityNumber());
        entity.setDateOfBirth(request.dateOfBirth());
        entity.setGender(request.gender());
        entity.setNationality(request.nationality());
        entity.setStreet(request.address());
        entity.setExpiryDate(request.expiryDate());
        entity.setCccdFrontUrl(request.cccdFrontUrl());
        entity.setCccdBackUrl(request.cccdBackUrl());
        entity.setFaceImageUrl(request.faceImageUrl());
        entity.setEkycVerified(request.identityNumber() != null && !request.identityNumber().isBlank());
        entity.setVerify(true);
        return entity;
    }

    public void updateKycInfo(User entity, RegisterShopRequest request) {
        if (entity == null || request == null) {
            return;
        }
        if (request.fullName() != null && !request.fullName().isBlank()) {
            entity.setFullName(request.fullName());
        }
        if (request.phone() != null && !request.phone().isBlank()) {
            entity.setPhone(request.phone());
        }
        if (request.identityNumber() != null && !request.identityNumber().isBlank()) {
            entity.setIdentityNumber(request.identityNumber());
            entity.setEkycVerified(true);
            entity.setVerify(true);
        }
        if (request.dateOfBirth() != null) {
            entity.setDateOfBirth(request.dateOfBirth());
        }
        if (request.gender() != null && !request.gender().isBlank()) {
            entity.setGender(request.gender());
        }
        if (request.nationality() != null && !request.nationality().isBlank()) {
            entity.setNationality(request.nationality());
        }
        if (request.address() != null && !request.address().isBlank()) {
            entity.setStreet(request.address());
        }
        if (request.expiryDate() != null) {
            entity.setExpiryDate(request.expiryDate());
        }
        if (request.cccdFrontUrl() != null && !request.cccdFrontUrl().isBlank()) {
            entity.setCccdFrontUrl(request.cccdFrontUrl());
        }
        if (request.cccdBackUrl() != null && !request.cccdBackUrl().isBlank()) {
            entity.setCccdBackUrl(request.cccdBackUrl());
        }
        if (request.faceImageUrl() != null && !request.faceImageUrl().isBlank()) {
            entity.setFaceImageUrl(request.faceImageUrl());
        }
    }

}
