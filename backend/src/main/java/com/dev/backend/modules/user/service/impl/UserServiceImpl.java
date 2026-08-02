package com.dev.backend.modules.user.service.impl;

import com.dev.backend.common.constant.ModuleConstants;
import com.dev.backend.common.enums.UserStatus;
import com.dev.backend.modules.role.entity.Role;
import com.dev.backend.modules.role.repository.RoleRepository;
import com.dev.backend.modules.user.dto.UserRequest;
import com.dev.backend.modules.user.dto.UserResponse;
import com.dev.backend.modules.user.entity.User;
import com.dev.backend.modules.user.mapper.UserMapper;
import com.dev.backend.modules.user.repository.UserRepository;
import com.dev.backend.modules.user.service.UserService;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;

    @Override
    @Transactional(readOnly = true)
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(userMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        return userMapper.toResponse(user);
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse getUserByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found with username: " + username));
        return userMapper.toResponse(user);
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
        return userMapper.toResponse(user);
    }


    @Override
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found with id: " + id);
        }
        userRepository.deleteById(id);
    }

    @Override
    public void insertData() {
        Object[][] roleUserData = {
            {"ROLE_ADMIN", "ADMIN", ModuleConstants.SYSTEM, "Quản trị viên hệ thống", "admin", "admin@gmail.com", "Quản Trị Viên", "0901234567"},
            {"ROLE_STAFF", "STAFF", ModuleConstants.SYSTEM, "Nhân viên hệ thống", "staff", "staff@gmail.com", "Nhân Viên System", "0901234568"},
            {"ROLE_SHOP", "SHOP", ModuleConstants.SHOP, "Chủ gian hàng / Cửa hàng", "shop", "shop@gmail.com", "Chủ Cửa Hàng", "0901234569"},
            {"ROLE_USER", "USER", ModuleConstants.USER, "Khách hàng người dùng", "user", "user@gmail.com", "Khách Hàng", "0901234570"}
        };

        for (Object[] item : roleUserData) {
            String code = (String) item[0];
            String name = (String) item[1];
            String module = (String) item[2];
            String description = (String) item[3];
            String username = (String) item[4];
            String email = (String) item[5];
            String fullName = (String) item[6];
            String phone = (String) item[7];

            Role role = roleRepository.findByCode(code)
                    .or(() -> roleRepository.findByName(name))
                    .orElseGet(() -> {
                        log.info("Creating role: {}", code);
                        return roleRepository.save(Role.builder()
                                .code(code)
                                .name(name)
                                .module(module)
                                .description(description)
                                .build());
                    });

            if (!userRepository.existsByUsername(username) && !userRepository.existsByEmail(email)) {
                log.info("Creating user account for role {}: {}", code, username);
                User user = User.builder()
                        .username(username)
                        .email(email)
                        .password(passwordEncoder.encode("Password123"))
                        .fullName(fullName)
                        .phone(phone)
                        .status(UserStatus.ACTIVE.name())
                        .enabled(true)
                        .accountNonLocked(true)
                        .failedAttempt(0)
                        .tokenVersion(0)
                        .build();

                User savedUser = userRepository.save(user);

                user.setRole(role);
                savedUser = userRepository.save(user);
            }
        }
    }
}
