package com.dev.backend.modules.role.mapper;

import com.dev.backend.modules.role.dto.RoleRequest;
import com.dev.backend.modules.role.dto.RoleResponse;
import com.dev.backend.modules.role.entity.Role;
import org.springframework.stereotype.Component;

@Component
public class RoleMapper {

    public Role toEntity(RoleRequest request) {
        if (request == null) {
            return null;
        }
        return Role.builder()
                .name(request.getName())
                .module(request.getModule())
                .code(request.getCode())
                .description(request.getDescription())
                .build();
    }

    public RoleResponse toResponse(Role entity) {
        if (entity == null) {
            return null;
        }
        return RoleResponse.builder()
                .id(entity.getId())
                .name(entity.getName())
                .module(entity.getModule())
                .code(entity.getCode())
                .description(entity.getDescription())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    public void updateEntityFromRequest(RoleRequest request, Role entity) {
        if (request == null || entity == null) {
            return;
        }
        if (request.getName() != null) {
            entity.setName(request.getName());
        }
        if (request.getModule() != null) {
            entity.setModule(request.getModule());
        }
        if (request.getCode() != null) {
            entity.setCode(request.getCode());
        }
        if (request.getDescription() != null) {
            entity.setDescription(request.getDescription());
        }
    }
}
