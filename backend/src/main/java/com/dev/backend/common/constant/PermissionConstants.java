package com.dev.backend.common.constant;

/**
 * Hằng số danh mục Mã quyền (Permission/Role Code) trong hệ thống
 */
public final class PermissionConstants {

    private PermissionConstants() {
        // Khởi tạo riêng tư để tránh tạo thể hiện
    }

    // Module Sản phẩm
    public static final String PRODUCT_VIEW = "PRODUCT_VIEW";       // Xem sản phẩm
    public static final String PRODUCT_CREATE = "PRODUCT_CREATE";   // Tạo mới sản phẩm
    public static final String PRODUCT_UPDATE = "PRODUCT_UPDATE";   // Cập nhật sản phẩm
    public static final String PRODUCT_DELETE = "PRODUCT_DELETE";   // Xóa sản phẩm

    // Module Đơn hàng
    public static final String ORDER_VIEW = "ORDER_VIEW";           // Xem đơn hàng
    public static final String ORDER_CREATE = "ORDER_CREATE";       // Tạo mới đơn hàng
    public static final String ORDER_UPDATE = "ORDER_UPDATE";       // Cập nhật đơn hàng (trạng thái, thông tin)
    public static final String ORDER_CANCEL = "ORDER_CANCEL";       // Hủy đơn hàng

    // Module Khách hàng
    public static final String CUSTOMER_VIEW = "CUSTOMER_VIEW";     // Xem danh sách/thông tin khách hàng
    public static final String CUSTOMER_UPDATE = "CUSTOMER_UPDATE"; // Cập nhật thông tin khách hàng
    public static final String CUSTOMER_BLOCK = "CUSTOMER_BLOCK";   // Khóa tài khoản khách hàng

    // Module Cửa hàng / Gian hàng
    public static final String SHOP_VIEW = "SHOP_VIEW";             // Xem thông tin cửa hàng
    public static final String SHOP_UPDATE = "SHOP_UPDATE";         // Cập nhật thông tin cửa hàng
    public static final String SHOP_APPROVE = "SHOP_APPROVE";       // Duyệt cửa hàng mới
    public static final String SHOP_BAN = "SHOP_BAN";               // Đình chỉ / Khóa cửa hàng

    // Module Khuyến mãi & Voucher
    public static final String PROMOTION_MANAGE = "PROMOTION_MANAGE"; // Quản lý chương trình khuyến mãi
    public static final String VOUCHER_MANAGE = "VOUCHER_MANAGE";     // Quản lý mã giảm giá

    // Module Tác giả, Nhà xuất bản & Thể loại
    public static final String AUTHOR_MANAGE = "AUTHOR_MANAGE";       // Quản lý thông tin tác giả
    public static final String PUBLISHER_MANAGE = "PUBLISHER_MANAGE"; // Quản lý nhà xuất bản
    public static final String GENRE_MANAGE = "GENRE_MANAGE";         // Quản lý thể loại sách

    // Module Hỗ trợ & Hệ thống
    public static final String SUPPORT_MANAGE = "SUPPORT_MANAGE";     // Quản lý yêu cầu hỗ trợ / khiếu nại
    public static final String SYSTEM_CONFIG = "SYSTEM_CONFIG";       // Quản lý cấu hình hệ thống
}
