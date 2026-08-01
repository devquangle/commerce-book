package com.dev.backend.common.constant;

/**
 * Hằng số chung của ứng dụng (Phân trang, Định dạng ngày tháng, ...)
 */
public final class AppConstants {

    private AppConstants() {
        // Khởi tạo riêng tư để tránh tạo thể hiện
    }

    public static final String DEFAULT_PAGE_NUMBER = "0";    // Trang mặc định (bắt đầu từ 0)
    public static final String DEFAULT_PAGE_SIZE = "10";      // Kích thước trang mặc định (10 phần tử/trang)
    public static final String DEFAULT_SORT_BY = "id";        // Trường sắp xếp mặc định
    public static final String DEFAULT_SORT_DIRECTION = "desc"; // Hướng sắp xếp mặc định (giảm dần)

    public static final String DATE_TIME_FORMAT = "yyyy-MM-dd HH:mm:ss"; // Định dạng ngày giờ chuẩn
    public static final String DATE_FORMAT = "yyyy-MM-dd";               // Định dạng ngày chuẩn
}
