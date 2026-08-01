package com.dev.backend.modules.user_role.service.impl;

import com.dev.backend.modules.user_role.entity.UserRole;
import com.dev.backend.modules.user_role.repository.UserRoleRepository;
import com.dev.backend.modules.user_role.service.UserRoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class UserRoleServiceImpl implements UserRoleService {

    private final UserRoleRepository userRoleRepository;

    @Override
    @Transactional(readOnly = true)
    public List<UserRole> getAllUserRoles() {
        return userRoleRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public UserRole getUserRoleById(Long id) {
        return userRoleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("UserRole not found with id: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserRole> getUserRolesByUserId(Long userId) {
        return userRoleRepository.findByUserId(userId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserRole> getUserRolesByRoleId(Long roleId) {
        return userRoleRepository.findByRoleId(roleId);
    }

    @Override
    public UserRole createUserRole(UserRole userRole) {
        return userRoleRepository.save(userRole);
    }

    @Override
    public void deleteUserRole(Long id) {
        if (!userRoleRepository.existsById(id)) {
            throw new RuntimeException("UserRole not found with id: " + id);
        }
        userRoleRepository.deleteById(id);
    }
}
