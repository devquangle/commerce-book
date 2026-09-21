package com.dev.backend.modules.user.service;

import com.dev.backend.common.constant.ModuleConstants;
import com.dev.backend.common.enums.UserStatus;
import com.dev.backend.common.exception.BadRequestException;
import com.dev.backend.common.exception.DuplicateFieldException;
import com.dev.backend.common.exception.NotFoundException;
import com.dev.backend.common.utils.UsernameUtils;
import com.dev.backend.modules.auth.dto.RegisterUserRequest;
import com.dev.backend.modules.role.entity.Role;
import com.dev.backend.modules.role.repository.RoleRepository;
import com.dev.backend.modules.shop.dto.RegisterShopRequest;
import com.dev.backend.modules.user.dto.UserResponse;
import com.dev.backend.modules.user.entity.User;
import com.dev.backend.modules.user.mapper.UserMapper;
import com.dev.backend.modules.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Objects;
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
    public void insertData() {
        Object[][] roleUserData = {
                { "ROLE_ADMIN", "ADMIN", ModuleConstants.SYSTEM, "Quản trị viên hệ thống", "admin", "admin@gmail.com",
                        "Quản Trị Viên", "0901234567" },
                { "ROLE_STAFF", "STAFF", ModuleConstants.SYSTEM, "Nhân viên hệ thống", "staff", "staff@gmail.com",
                        "Nhân Viên System", "0901234568" },
                { "ROLE_SHOP", "SHOP", ModuleConstants.SHOP, "Chủ gian hàng / Cửa hàng", "shop", "shop@gmail.com",
                        "Chủ Cửa Hàng", "0901234569" },
                { "ROLE_USER", "USER", ModuleConstants.USER, "Khách hàng người dùng", "user", "user@gmail.com",
                        "Khách Hàng", "0901234570" }
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
                        Role newRole = new Role();
                        newRole.setCode(code);
                        newRole.setName(name);
                        newRole.setModule(module);
                        newRole.setDescription(description);
                        return roleRepository.save(newRole);
                    });

            if (!userRepository.existsByUsername(username) && !userRepository.existsByEmail(email)) {
                log.info("Creating user account for role {}: {}", code, username);
                User user = new User();
                user.setUsername(username);
                user.setEmail(email);
                user.setPassword(passwordEncoder.encode("Password123"));
                user.setFullName(fullName);
                user.setPhone(phone);
                user.setStatus(UserStatus.ACTIVE.name());
                user.setEnabled(true);
                user.setAccountNonLocked(true);
                user.setFailedAttempts(0);
                user.setTokenVersion(0);

                User savedUser = userRepository.save(user);

                user.setRole(role);
                savedUser = userRepository.save(user);
            }
        }
    }

    @Override
    public User createAccountShop(RegisterShopRequest req) {
        if (!Objects.equals(req.password(), req.confirmPassword())) {
            throw new BadRequestException("Mật khẩu xác nhận không khớp.");
        }

        DuplicateFieldException errors = new DuplicateFieldException(new HashMap<>());
        if (userRepository.existsByEmail(req.email())) {
            errors.addError("email", "Email đã được sử dụng.");
        }
        if (userRepository.existsByPhone(req.phone())) {
            errors.addError("phone", "Số điện thoại đã được sử dụng.");
        }
        if (!errors.getErrors().isEmpty()) {
            throw errors;
        }

        User user = userMapper.toAccount(req);

        String username;
        do {
            username = UsernameUtils.generateRandomUsername();
        } while (userRepository.existsByUsername(username));
        user.setUsername(username);

        user.setPassword(passwordEncoder.encode(req.password()));

        Role role = roleRepository.findByCode("ROLE_SHOP")
                .or(() -> roleRepository.findByName(ModuleConstants.SHOP))
                .orElseThrow(() -> new NotFoundException("Role ROLE_SHOP không tồn tại"));
        user.setRole(role);

        user.setStatus(UserStatus.ACTIVE.name());
        user.setEnabled(true);
        user.setAccountNonLocked(true);
        user.setFailedAttempts(0);
        user.setTokenVersion(0);

        return userRepository.save(user);
    }

}
