package com.dev.backend.modules.auth.service.impl;

import com.dev.backend.common.constant.JwtType;
import com.dev.backend.modules.auth.dto.AuthResponse;
import com.dev.backend.modules.auth.dto.ChangePasswordRequest;
import com.dev.backend.modules.auth.dto.LoginRequest;
import com.dev.backend.modules.auth.dto.RefreshTokenRequest;
import com.dev.backend.modules.auth.dto.RegisterRequest;
import com.dev.backend.modules.auth.dto.UpdateProfileRequest;
import com.dev.backend.modules.auth.repository.AuthRepository;
import com.dev.backend.modules.auth.service.AuthService;
import com.dev.backend.modules.role.entity.Role;
import com.dev.backend.modules.role.repository.RoleRepository;
import com.dev.backend.modules.user.dto.UserResponse;
import com.dev.backend.modules.user.entity.User;
import com.dev.backend.modules.user.mapper.UserMapper;

import com.dev.backend.security.custom.CustomUserDetails;
import com.dev.backend.security.jwt.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AuthRepository authRepository;
    private final RoleRepository roleRepository;

    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final UserMapper userMapper;

    @Override
    @Transactional
    public AuthResponse login(LoginRequest request) {
        User user = authRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Email hoặc mật khẩu không chính xác"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Email hoặc mật khẩu không chính xác");
        }

        if (!user.isEnabled()) {
            throw new RuntimeException("Tài khoản chưa được kích hoạt");
        }

        if (!user.isAccountNonLocked()) {
            throw new RuntimeException("Tài khoản đã bị khóa");
        }

        CustomUserDetails userDetails = CustomUserDetails.build(user);
        String accessToken = jwtUtil.generateAccessToken(userDetails);
        String refreshToken = jwtUtil.generateRefreshToken(user.getId(), user.getTokenVersion() == null ? 0 : user.getTokenVersion());

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .user(userMapper.toResponse(user))
                .build();
    }

    @Override
    @Transactional
    public UserResponse register(RegisterRequest request) {
        if (Boolean.TRUE.equals(authRepository.existsByEmail(request.getEmail()))) {
            throw new RuntimeException("Email đã được sử dụng");
        }

        if (Boolean.TRUE.equals(authRepository.existsByUsername(request.getUsername()))) {
            throw new RuntimeException("Tên đăng nhập đã được sử dụng");
        }

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .phone(request.getPhone())
                .enabled(true)
                .accountNonLocked(true)
                .tokenVersion(0)
                .failedAttempt(0)
                .build();

        User savedUser = authRepository.save(user);

        Optional<Role> defaultRole = roleRepository.findByCode("ROLE_USER")
                .or(() -> roleRepository.findByName("USER"))
                .or(() -> roleRepository.findByName("ROLE_USER"));

        defaultRole.ifPresent(role -> {
            savedUser.setRole(role);
            authRepository.save(savedUser);
        });

        return userMapper.toResponse(savedUser);
    }

    @Override
    @Transactional(readOnly = true)
    public AuthResponse refreshToken(RefreshTokenRequest request) {
        String token = request.getRefreshToken();
        if (!jwtUtil.isValid(token, JwtType.REFRESH)) {
            throw new RuntimeException("RefreshToken không hợp lệ hoặc đã hết hạn");
        }

        Long userId = jwtUtil.extractUserId(token);
        User user = authRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        int currentTokenVersion = user.getTokenVersion() == null ? 0 : user.getTokenVersion();
        if (!jwtUtil.isTokenVersionValid(token, currentTokenVersion)) {
            throw new RuntimeException("RefreshToken đã bị vô hiệu hóa");
        }

        CustomUserDetails userDetails = CustomUserDetails.build(user);
        String newAccessToken = jwtUtil.generateAccessToken(userDetails);
        String newRefreshToken = jwtUtil.generateRefreshToken(user.getId(), currentTokenVersion);

        return AuthResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(newRefreshToken)
                .tokenType("Bearer")
                .user(userMapper.toResponse(user))
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse getProfile(Long userId) {
        User user = authRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));
        return userMapper.toResponse(user);
    }

    @Override
    @Transactional
    public UserResponse updateProfile(Long userId, UpdateProfileRequest request) {
        User user = authRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        if (request.getFullName() != null) {
            user.setFullName(request.getFullName());
        }
        if (request.getPhone() != null) {
            user.setPhone(request.getPhone());
        }
        if (request.getAvatarUrl() != null) {
            user.setAvatarUrl(request.getAvatarUrl());
        }
        if (request.getStreet() != null) {
            user.setStreet(request.getStreet());
        }

        User updatedUser = authRepository.save(user);
        return userMapper.toResponse(updatedUser);
    }

    @Override
    @Transactional
    public void changePassword(Long userId, ChangePasswordRequest request) {
        User user = authRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new RuntimeException("Mật khẩu cũ không chính xác");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        int currentVersion = user.getTokenVersion() == null ? 0 : user.getTokenVersion();
        user.setTokenVersion(currentVersion + 1);

        authRepository.save(user);
    }

    @Override
    @Transactional
    public void logout(Long userId) {
        User user = authRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        int currentVersion = user.getTokenVersion() == null ? 0 : user.getTokenVersion();
        user.setTokenVersion(currentVersion + 1);

        authRepository.save(user);
    }
}
