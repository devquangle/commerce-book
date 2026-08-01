package com.dev.backend.common.enums;

/**
 * Trạng thái vòng đời đơn hàng
 */
public enum OrderStatus {
    PENDING,    // Chờ xử lý / Chờ xác nhận
    CONFIRMED,  // Đã xác nhận đơn hàng
    PROCESSING, // Đang đóng gói / Đang xử lý
    SHIPPING,   // Đang vận chuyển
    DELIVERED,  // Đã giao hàng thành công
    COMPLETED,  // Đã hoàn thành đơn hàng
    CANCELLED,  // Đã hủy đơn hàng
    RETURNED,   // Đã trả hàng
    REFUNDED    // Đã hoàn tiền
}
