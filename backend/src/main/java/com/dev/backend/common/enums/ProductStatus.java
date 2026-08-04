package com.dev.backend.common.enums;

/**
 * Trạng thái sản phẩm
 */
public enum ProductStatus {
    PENDING_APPROVAL, // Chờ duyệt
    ACTIVE, // Đang bán
    INACTIVE, // Tạm ngừng bán
    REJECTED, // Bị từ chối
    BANNED, // Bị khóa do vi phạm
    DELETED // Xóa mềm
}
