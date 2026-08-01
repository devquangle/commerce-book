package com.dev.backend.common.constant;

/**
 * Hằng số liên quan đến Người dùng và Tài khoản
 */
public final class UserConstants {

    private UserConstants() {
        // Khởi tạo riêng tư để tránh tạo thể hiện
    }

    public static final int MAX_FAILED_ATTEMPTS = 5;                        // Số lần đăng nhập sai tối đa trước khi khóa tài khoản
    public static final String DEFAULT_AVATAR_URL = "/images/default-avatar.png"; // Đường dẫn ảnh đại diện mặc định
}
