package com.dev.backend.modules.user_role.service;

import com.dev.backend.modules.user_role.entity.UserRole;

import java.util.List;

public interface UserRoleService {
    List<UserRole> getAllUserRoles();
    UserRole getUserRoleById(Long id);
    List<UserRole> getUserRolesByUserId(Long userId);
    List<UserRole> getUserRolesByRoleId(Long roleId);
    UserRole createUserRole(UserRole userRole);
    void deleteUserRole(Long id);
}
