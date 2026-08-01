package com.dev.backend.modules.user.mapper;

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
                .role(entity.getRole().getName())
                .build();
    }

   
}
