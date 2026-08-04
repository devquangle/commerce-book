package com.dev.backend.modules.auth.controller;

import com.dev.backend.modules.auth.dto.LoginResponse;
import com.dev.backend.modules.auth.dto.RefreshResponse;
import com.dev.backend.common.response.ResponseData;
import com.dev.backend.common.response.ResponseUtil;
import com.dev.backend.modules.auth.dto.ChangePasswordRequest;
import com.dev.backend.modules.auth.dto.LoginRequest;
import com.dev.backend.modules.auth.dto.RegisterRequest;
import com.dev.backend.modules.auth.service.AuthService;
import com.dev.backend.modules.user.dto.UserRequest;
import com.dev.backend.modules.user.dto.UserResponse;
import com.dev.backend.security.custom.CustomUserDetails;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
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
    public ResponseEntity<ResponseData<LoginResponse>> login(@Valid @RequestBody LoginRequest request,HttpServletResponse response) {
        LoginResponse data = authService.login(request,response);
        return ResponseUtil.success("Login thành công", data);
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(@Valid @RequestBody RegisterRequest request) {
        UserResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/refresh")
    public ResponseEntity<ResponseData<RefreshResponse>> refreshToken(HttpServletRequest request) {

        RefreshResponse data = authService.refreshToken(request);
        return ResponseUtil.success("refresh success", data);
    }

    @GetMapping("/me")
    public ResponseEntity<ResponseData<UserResponse>> getProfile(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        UserResponse response = authService.getProfile(userDetails.getUserId());
        return ResponseUtil.success("DATA", response);
    }

    @PutMapping("/me")
    public ResponseEntity<ResponseData<UserResponse>> updateProfile(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody UserRequest request) {

        UserResponse response = authService.updateProfile(userDetails.getUserId(), request);
        return ResponseUtil.success("DATA =========", response);
    }

    @PutMapping("/change-password")
    public ResponseEntity<ResponseData<Void>> changePassword(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody ChangePasswordRequest request) {

        authService.changePassword(userDetails.getUserId(), request);
        return ResponseUtil.success("DATA =========", null);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@AuthenticationPrincipal CustomUserDetails userDetails) {
        if (userDetails != null) {
            authService.logout(userDetails.getUserId());
        }
        return ResponseEntity.ok().build();
    }
}
