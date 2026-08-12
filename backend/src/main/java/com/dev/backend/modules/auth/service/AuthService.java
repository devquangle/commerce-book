package com.dev.backend.modules.auth.service;

import com.dev.backend.modules.auth.dto.LoginResponse;
import com.dev.backend.modules.auth.dto.RefreshResponse;
import com.dev.backend.modules.auth.dto.ChangePasswordRequest;
import com.dev.backend.modules.auth.dto.LoginRequest;
import com.dev.backend.modules.auth.dto.RegisterRequest;
import com.dev.backend.modules.auth.dto.RegisterUserRequest;
import com.dev.backend.modules.user.dto.UserRequest;
import com.dev.backend.modules.user.dto.UserResponse;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public interface AuthService {

    LoginResponse login(LoginRequest request, HttpServletResponse response);

    RefreshResponse refreshToken(HttpServletRequest request);

    void validate(UserRequest request);

    UserResponse register(RegisterRequest request);

    UserResponse getProfile(Long userId);

    UserResponse updateProfile(Long userId, UserRequest request);

    void changePassword(Long userId, ChangePasswordRequest request);

    void logout(Long userId);

    boolean existsByEmail(String email);

    boolean existsByUsername(String username);

    boolean existsByPhone(String phone);

    void register(RegisterUserRequest request);

    
    void validate(String email);
}
