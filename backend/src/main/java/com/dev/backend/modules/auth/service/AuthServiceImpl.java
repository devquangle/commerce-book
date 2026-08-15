package com.dev.backend.modules.auth.service;

import com.dev.backend.common.constant.ApiErrorCode;
import com.dev.backend.common.constant.JwtType;
import com.dev.backend.common.exception.AppException;
import com.dev.backend.common.exception.BadRequestException;
import com.dev.backend.common.exception.DuplicateFieldException;
import com.dev.backend.common.exception.NotFoundException;
import com.dev.backend.common.exception.UnauthorizedException;
import com.dev.backend.common.utils.CookieUtil;
import com.dev.backend.common.utils.UsernameUtils;
import com.dev.backend.modules.auth.dto.LoginResponse;
import com.dev.backend.modules.auth.dto.RefreshResponse;
import com.dev.backend.modules.auth.dto.ChangePasswordRequest;
import com.dev.backend.modules.auth.dto.LoginRequest;
import com.dev.backend.modules.auth.dto.RegisterRequest;
import com.dev.backend.modules.auth.dto.RegisterUserRequest;
import com.dev.backend.modules.auth.repository.AuthRepository;
import com.dev.backend.modules.others.email.service.SendEmailService;
import com.dev.backend.modules.role.service.RoleService;
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

import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Objects;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AuthRepository authRepository;
    private final RoleService roleService;
    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final UserMapper userMapper;
    private final SendEmailService sendEmailService;

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
    @Transactional
    public String processLoginFail(String email) {

        User user = authRepository.findByEmail(email)
                .orElseThrow(() -> new UnauthorizedException(
                        "Email hoặc mật khẩu không chính xác"));

        int failedAttempts = user.getFailedAttempts() + 1;

        user.setFailedAttempts(failedAttempts);

        if (failedAttempts >= 5) {

            user.setAccountNonLocked(false);

            authRepository.save(user);

            return "Tài khoản đã bị khóa do nhập sai mật khẩu 5 lần";
        }

        authRepository.save(user);

        int remaining = 5 - failedAttempts;

        return "Mật khẩu không chính xác. Bạn còn "
                + remaining
                + " lần thử";
    }
    @Override
    public void resetFailedAttempts(User user) {
        user.setFailedAttempts(0);
        authRepository.save(user);
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
            resetFailedAttempts(user);

            log.debug("Login success. Access token: {}", accessToken);
            return LoginResponse.builder()
                    .accessToken(accessToken)
                    .build();

        } catch (BadCredentialsException ex) {
            String message =
                processLoginFail(
                        loginRequest.getEmail()
                );

        throw new UnauthorizedException(message);
        }
    }

    @Override
    @Transactional
    public UserResponse register(RegisterRequest request) {
        return null;
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

        int currentTokenVersion = user.getTokenVersion();
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
        String oldEmail = user.getEmail();
        String oldPhone = user.getPhone();
        String newEmail = request.getEmail();
        String newPhone = request.getPhone();
        if (!Objects.equals(oldEmail, newEmail)
                || !Objects.equals(oldPhone, newPhone)) {
            validate(request);
        }

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

        int currentVersion = user.getTokenVersion();
        user.setTokenVersion(currentVersion + 1);

        authRepository.save(user);
    }

    @Override
    @Transactional
    public void logout(Long userId) {
        User user = authRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        int currentVersion = user.getTokenVersion();
        user.setTokenVersion(currentVersion + 1);

        authRepository.save(user);
    }

    @Override
    public void validate(String email) {
        DuplicateFieldException errors = new DuplicateFieldException(new HashMap<>());

        if (existsByEmail(email)) {
            errors.addError("email", "Email đã được sử dụng.");
        }

        if (!errors.getErrors().isEmpty()) {
            throw errors;
        }
    }

    @Override
    public void register(RegisterUserRequest request) {
        User user = new User();
        validate(request.email());
        if (!Objects.equals(request.password(), request.password())) {
            throw new BadRequestException("Mật khẩu xác nhận không khớp.");
        }
        user.setEmail(request.email());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setRole(roleService.getRoleUser());
        String username;
        do {
            username = UsernameUtils.generateRandomUsername();
        } while (existsByUsername(username));

        user.setUsername(username);

        User saved = authRepository.save(user);
        String verifyToken = jwtUtil.generateVerifyToken(saved.getId(), saved.getTokenVersion());
        sendEmailService.sendEmailRegister(saved.getEmail(),
                "Cảm ơn bạn đã đăng ký tài khoản, vui lòng kích hoạt tài khoản", verifyToken);

    }

    @Override
    public void verifyRegister(String token) {
        User user = getUserFromVerifyToken(token);

        if (user.isEnabled()) {
            throw new AppException(
                    HttpStatus.BAD_REQUEST.value(),
                    "Tài khoản đã được kích hoạt",
                    ApiErrorCode.ACCOUNT_ALREADY_VERIFIED);
        }

        user.setEnabled(true);
        authRepository.save(user);
    }

    @Override
    public void resendVerificationEmail(String token) {
        User user = getUserFromVerifyToken(token);

        if (user.isEnabled()) {
            throw new AppException(
                    HttpStatus.BAD_REQUEST.value(),
                    "Tài khoản đã được kích hoạt",
                    ApiErrorCode.ACCOUNT_ALREADY_VERIFIED);
        }

        user.setTokenVersion(user.getTokenVersion() + 1);

        User saved = authRepository.save(user);

        String verifyToken = jwtUtil.generateVerifyToken(
                saved.getId(),
                saved.getTokenVersion());

        sendEmailService.sendEmailRegister(
                saved.getEmail(),
                "Cảm ơn bạn đã đăng ký tài khoản, vui lòng kích hoạt tài khoản",
                verifyToken);
    }

    private User getUserFromVerifyToken(String token) {
        if (!jwtUtil.isValid(token, JwtType.VERIFY_EMAIL)) {
            throw new AppException(
                    HttpStatus.BAD_REQUEST.value(),
                    "Token không hợp lệ hoặc đã hết hạn",
                    ApiErrorCode.JWT_INVALID);
        }

        Long userId = jwtUtil.extractUserId(token);

        return authRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy người dùng"));
    }
}
