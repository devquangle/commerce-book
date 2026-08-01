package com.dev.backend.modules.auth.controller;

import com.dev.backend.modules.auth.dto.LoginResponse;
import com.dev.backend.common.response.ResponseData;
import com.dev.backend.common.response.ResponseUtil;
import com.dev.backend.modules.auth.dto.ChangePasswordRequest;
import com.dev.backend.modules.auth.dto.LoginRequest;
import com.dev.backend.modules.auth.dto.RefreshTokenRequest;
import com.dev.backend.modules.auth.dto.RegisterRequest;
import com.dev.backend.modules.auth.service.AuthService;
import com.dev.backend.modules.user.dto.UserRequest;
import com.dev.backend.modules.user.dto.UserResponse;
import com.dev.backend.security.custom.CustomUserDetails;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<ResponseData<LoginResponse>> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = authService.login(request);
        return ResponseUtil.success("Login thành công", response);
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(@Valid @RequestBody RegisterRequest request) {
        UserResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/refresh")
    public ResponseEntity<LoginResponse> refreshToken(@Valid @RequestBody RefreshTokenRequest request) {
        LoginResponse response = authService.refreshToken(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<ResponseData<UserResponse>> getProfile(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        UserResponse response = authService.getProfile(userDetails.getId());
        return ResponseUtil.success("DATA", response);
    }

    @PutMapping("/me")
    public ResponseEntity<ResponseData<UserResponse>> updateProfile(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody UserRequest request) {

        UserResponse response = authService.updateProfile(userDetails.getId(), request);
        return ResponseUtil.success("DATA =========", response);
    }

    @PutMapping("/change-password")
    public ResponseEntity<ResponseData<Void>> changePassword(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody ChangePasswordRequest request) {

        authService.changePassword(userDetails.getId(), request);
        return ResponseUtil.success("DATA =========", null);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@AuthenticationPrincipal CustomUserDetails userDetails) {
        if (userDetails != null) {
            authService.logout(userDetails.getId());
        }
        return ResponseEntity.ok().build();
    }
}
