package com.dev.backend.modules.auth.service;

import com.dev.backend.modules.auth.dto.AuthResponse;
import com.dev.backend.modules.auth.dto.ChangePasswordRequest;
import com.dev.backend.modules.auth.dto.LoginRequest;
import com.dev.backend.modules.auth.dto.RefreshTokenRequest;
import com.dev.backend.modules.auth.dto.RegisterRequest;
import com.dev.backend.modules.auth.dto.UpdateProfileRequest;
import com.dev.backend.modules.user.dto.UserResponse;

public interface AuthService {

    AuthResponse login(LoginRequest request);

    UserResponse register(RegisterRequest request);

    AuthResponse refreshToken(RefreshTokenRequest request);

    UserResponse getProfile(Long userId);

    UserResponse updateProfile(Long userId, UpdateProfileRequest request);

    void changePassword(Long userId, ChangePasswordRequest request);

    void logout(Long userId);
}
