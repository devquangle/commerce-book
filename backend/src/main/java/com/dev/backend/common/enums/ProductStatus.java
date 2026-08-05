package com.dev.backend.common.enums;

/**
 * Trạng thái sản phẩm
 */
public enum ProductStatus {
    REJECTED, // Bị từ chối
    PENDING_APPROVAL, // Chờ duyệt
    ACTIVE, // Đang bán
    INACTIVE, // Tạm ngừng bán
    BANNED, // Bị khóa do vi phạm
    DELETED // Xóa mềm
}
