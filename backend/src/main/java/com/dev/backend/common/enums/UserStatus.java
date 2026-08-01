package com.dev.backend.common.enums;

/**
 * Trạng thái tài khoản người dùng
 */
public enum UserStatus {
    ACTIVE,   // Đang hoạt động
    INACTIVE, // Tạm ngưng hoạt động / Chưa kích hoạt
    BLOCKED,  // Bị khóa tài khoản
    PENDING   // Chờ xác thực
}
