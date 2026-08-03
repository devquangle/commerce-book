package com.dev.backend.modules.auth.service;

import com.dev.backend.common.constant.JwtType;
import com.dev.backend.common.exception.BadRequestException;
import com.dev.backend.common.exception.DuplicateFieldException;
import com.dev.backend.common.exception.UnauthorizedException;
import com.dev.backend.common.utils.CookieUtil;
import com.dev.backend.modules.auth.dto.LoginResponse;
import com.dev.backend.modules.auth.dto.RefreshResponse;
import com.dev.backend.modules.auth.dto.ChangePasswordRequest;
import com.dev.backend.modules.auth.dto.LoginRequest;
import com.dev.backend.modules.auth.dto.RegisterRequest;
import com.dev.backend.modules.auth.repository.AuthRepository;
import com.dev.backend.modules.role.entity.Role;
import com.dev.backend.modules.role.repository.RoleRepository;
import com.dev.backend.modules.user.dto.UserRequest;
import com.dev.backend.modules.user.dto.UserResponse;
import com.dev.backend.modules.user.entity.User;
import com.dev.backend.modules.user.mapper.UserMapper;

import com.dev.backend.security.custom.CustomUserDetails;
import com.dev.backend.security.jwt.JwtUtil;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AuthRepository authRepository;
    private final RoleRepository roleRepository;
    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final UserMapper userMapper;

    @Override
    @Transactional(readOnly = true)
    public boolean existsByEmail(String email) {
        return authRepository.existsByEmail(email);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsByUsername(String username) {
        return authRepository.existsByUsername(username);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsByPhone(String phone) {
        return authRepository.existsByPhone(phone);
    }

    @Override
    public LoginResponse login(LoginRequest loginRequest, HttpServletResponse response) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(),
                            loginRequest.getPassword()));

            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
            User user = userDetails.getUser();

            log.info("User login {}", loginRequest.getEmail());

            if (!user.isEnabled()) {
                throw new UnauthorizedException("Tài khoản chưa được kích hoạt");
            }

            if (!user.isAccountNonLocked()) {
                throw new UnauthorizedException("Tài khoản đã bị khóa");
            }

            String accessToken = jwtUtil.generateAccessToken(userDetails);

            String refreshToken = jwtUtil.generateRefreshToken(
                    user.getId(),
                    user.getTokenVersion());
            CookieUtil.addCookie(response, "refreshToken", refreshToken);
            // userService.resetFailedAttempts(user);

            log.debug("Login success. Access token: {}", accessToken);
            return LoginResponse.builder()
                    .accessToken(accessToken)
                    .build();

        } catch (BadCredentialsException ex) {
            // userService.processLoginFail(loginRequest.getEmail());
            throw ex;
        }
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
    public RefreshResponse refreshToken(HttpServletRequest request) {
        String refreshToken = CookieUtil.getCookie(request, "refreshToken");
        if (!jwtUtil.isValid(refreshToken, JwtType.REFRESH)) {
            throw new UnauthorizedException("Token không hợp lệ");
        }
        Long userId = jwtUtil.extractUserId(refreshToken);
        User user = authRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));
        if (!jwtUtil.isTokenVersionValid(refreshToken, user.getTokenVersion())) {
            throw new UnauthorizedException("Token đã bị thu hồi");
        }

        CustomUserDetails customUserDetails = CustomUserDetails.build(user);

        int currentTokenVersion = user.getTokenVersion() == null ? 0 : user.getTokenVersion();
        if (!jwtUtil.isTokenVersionValid(refreshToken, currentTokenVersion)) {
            throw new RuntimeException("RefreshToken đã bị vô hiệu hóa");
        }

        String newAccessToken = jwtUtil.generateAccessToken(customUserDetails);

        return RefreshResponse.builder()
                .accessToken(newAccessToken)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public void validate(UserRequest request) {
        DuplicateFieldException errors = new DuplicateFieldException(new HashMap<>());
        if (existsByPhone(request.getPhone())) {
            errors.addError("phone", "Số điện thoại đã được sử dụng.");
        }
        if (existsByEmail(request.getEmail())) {
            errors.addError("email", "Email đã được sử dụng.");
        }

        if (!errors.getErrors().isEmpty()) {
            throw errors;
        }
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
    public UserResponse updateProfile(Long userId, UserRequest request) {
        User user = authRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));
        validate(request);
        userMapper.toProfile(user, request);
        return userMapper.toResponse(authRepository.save(user));
    }

    @Override
    @Transactional
    public void changePassword(Long userId, ChangePasswordRequest request) {
        User user = authRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));
        DuplicateFieldException errors = new DuplicateFieldException(new HashMap<>());

        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            errors.addError("oldPassword", "Mật khẩu cũ không đúng.");
        }
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new BadRequestException("Mật khẩu xác nhận không khớp.");
        }
        if (!errors.getErrors().isEmpty()) {
            throw errors;
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
