package com.dev.backend.common.enums;

/**
 * Trạng thái cửa hàng / gian hàng
 */
public enum ShopStatus {
    PENDING,   // Chờ duyệt đăng ký cửa hàng
    ACTIVE,    // Đang hoạt động
    INACTIVE,  // Tạm ngưng hoạt động
    SUSPENDED, // Bị tạm đình chỉ
    BANNED     // Bị cấm / Khóa gian hàng vĩnh viễn
}
