package com.dev.backend.common.enums;

/**
 * Trạng thái sản phẩm
 */
public enum ProductStatus {
    DRAFT,    // Bản nháp (chưa mở bán)
    ACTIVE,   // Đang mở bán
    INACTIVE, // Tạm ngưng bán
    DELETED,  // Đã xóa (xóa mềm)
    BANNED    // Bị vi phạm / Bị vi phạm quy định khóa bán
}
