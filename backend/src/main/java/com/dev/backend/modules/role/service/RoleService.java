package com.dev.backend.modules.role.service;

import com.dev.backend.modules.role.dto.RoleRequest;
import com.dev.backend.modules.role.dto.RoleResponse;

import java.util.List;

public interface RoleService {
    List<RoleResponse> getAllRoles();
    RoleResponse getRoleById(Long id);
    RoleResponse getRoleByName(String name);
    RoleResponse getRoleByCode(String code);
    RoleResponse createRole(RoleRequest request);
    RoleResponse updateRole(Long id, RoleRequest request);
    void deleteRole(Long id);
}
