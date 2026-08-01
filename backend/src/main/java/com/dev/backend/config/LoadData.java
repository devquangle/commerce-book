package com.dev.backend.config;

import com.dev.backend.common.constant.ModuleConstants;
import com.dev.backend.common.enums.UserStatus;
import com.dev.backend.modules.role.entity.Role;
import com.dev.backend.modules.role.repository.RoleRepository;
import com.dev.backend.modules.user.entity.User;
import com.dev.backend.modules.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Tải dữ liệu ban đầu cho hệ thống khi ứng dụng khởi chạy.
 * Mỗi role sẽ được tạo 1 tài khoản tương ứng nếu chưa tồn tại.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class LoadData implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        insertData();
    }

    @Transactional
    public void insertData() {
        log.info("Đang kiểm tra và khởi tạo dữ liệu mẫu cho hệ thống...");

        Object[][] roleUserData = {
            {"ROLE_ADMIN", "ADMIN", ModuleConstants.SYSTEM, "Quản trị viên hệ thống", "admin", "admin@gmail.com", "Quản Trị Viên", "0901234567"},
            {"ROLE_STAFF", "STAFF", ModuleConstants.SYSTEM, "Nhân viên hệ thống", "staff", "staff@gmail.com", "Nhân Viên System", "0901234568"},
            {"ROLE_SHOP", "SHOP", ModuleConstants.SHOP, "Chủ gian hàng / Cửa hàng", "shop", "shop@gmail.com", "Chủ Cửa Hàng", "0901234569"},
            {"ROLE_USER", "USER", ModuleConstants.CUSTOMER, "Khách hàng người dùng", "user", "user@gmail.com", "Khách Hàng", "0901234570"}
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

            // Kiểm tra hoặc tạo mới Role
            Role role = roleRepository.findByCode(code)
                    .or(() -> roleRepository.findByName(name))
                    .orElseGet(() -> {
                        log.info("Tạo mới role: {}", code);
                        return roleRepository.save(Role.builder()
                                .code(code)
                                .name(name)
                                .module(module)
                                .description(description)
                                .build());
                    });

            // Kiểm tra hoặc tạo mới Tài khoản cho Role
            if (!userRepository.existsByUsername(username) && !userRepository.existsByEmail(email)) {
                log.info("Tạo mới tài khoản cho role {}: {}", code, username);
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

                // Gán role trực tiếp cho người dùng
                user.setRole(role);
                 userRepository.save(savedUser);
            }
        }

        log.info("Khởi tạo dữ liệu mẫu hoàn tất.");
    }
}
