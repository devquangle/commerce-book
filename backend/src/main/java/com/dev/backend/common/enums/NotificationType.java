package com.dev.backend.common.enums;

/**
 * Loại thông báo trong hệ thống
 */
public enum NotificationType {
    PRODUCT,   // Thông báo liên quan đến sản phẩm
    ORDER,     // Thông báo liên quan đến đơn hàng
    AUTHOR,    // Thông báo liên quan đến tác giả
    PUBLISHER, // Thông báo liên quan đến nhà xuất bản
    PROMOTION, // Thông báo khuyến mãi
    VOUCHER,   // Thông báo mã giảm giá
    GENRE,     // Thông báo liên quan đến thể loại
    SUPPORT,   // Thông báo hỗ trợ khách hàng
    SYSTEM,    // Thông báo từ hệ thống
    CUSTOMER,  // Thông báo liên quan đến tài khoản khách hàng
    SHOP       // Thông báo liên quan đến cửa hàng
}
