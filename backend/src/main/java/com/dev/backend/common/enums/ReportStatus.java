package com.dev.backend.common.enums;

/**
 * Trạng thái xử lý báo cáo vi phạm (Sản phẩm / Cửa hàng)
 */
public enum ReportStatus {
    PENDING,    // Chờ tiếp nhận báo cáo
    PROCESSING, // Đang tiến hành kiểm tra / xử lý
    APPROVED,   // Đã chấp nhận báo cáo vi phạm (đã xử lý đối tượng bị báo cáo)
    REJECTED,   // Báo cáo bị từ chối / Không vi phạm
    RESOLVED    // Đã giải quyết xong báo cáo
}
