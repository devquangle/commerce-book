package com.dev.backend.common.constant;

/**
 * Hằng số danh mục các Module trong hệ thống
 */
public final class ModuleConstants {

    private ModuleConstants() {
        // Khởi tạo riêng tư để tránh tạo thể hiện
    }

    public static final String PRODUCT = "PRODUCT";       // Module Quản lý Sản phẩm
    public static final String ORDER = "ORDER";           // Module Quản lý Đơn hàng
    public static final String PROMOTION = "PROMOTION";   // Module Quản lý Chương trình khuyến mãi
    public static final String VOUCHER = "VOUCHER";       // Module Quản lý Mã giảm giá (Voucher)
    public static final String SUPPORT = "SUPPORT";       // Module Quản lý Hỗ trợ & Phản hồi
    public static final String SYSTEM = "SYSTEM";         // Module Quản lý Cấu hình Hệ thống
    public static final String USER = "USER";             // Module Quản lý Khách hàng
    public static final String SHOP = "SHOP";             // Module Quản lý Cửa hàng / Gian hàng
    public static final String SUPERADMIN = "SUPERADMIN"; // Module Quản trị viên cấp cao
    public static final String REVIEW = "REVIEW";         // Module Quản lý Đánh giá / Nhận xét
}
