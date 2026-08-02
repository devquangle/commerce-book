package com.dev.backend.common.utils;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;

public class CookieUtil {

    public static final int EXPIRE_7_DAYS = 60 * 60 * 24 * 7;

    private static final String PATH = "/";
    private static final boolean HTTP_ONLY = true;
    private static final boolean SECURE = false; // localhost = false, HTTPS = true
    private static final String SAME_SITE = "Lax"; // Lax, Strict, or None

    // SET COOKIE (Mặc định 7 ngày)
    public static void addCookie(HttpServletResponse response, String name, String value) {
        addCookie(response, name, value, EXPIRE_7_DAYS);
    }

    // SET COOKIE (Tùy chỉnh thời gian hết hạn)
    public static void addCookie(HttpServletResponse response, String name, String value, int maxAge) {
        ResponseCookie cookie = ResponseCookie.from(name, value)
                .path(PATH)
                .httpOnly(HTTP_ONLY)
                .secure(SECURE)
                .sameSite(SAME_SITE)
                .maxAge(maxAge)
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }

    // GET COOKIE
    public static String getCookie(HttpServletRequest request, String name) {
        if (request.getCookies() == null) return null;

        for (Cookie cookie : request.getCookies()) {
            if (cookie.getName().equals(name)) {
                return cookie.getValue();
            }
        }
        return null;
    }

    // DELETE COOKIE (QUAN TRỌNG)
    public static void deleteCookie(HttpServletResponse response, String name) {
        ResponseCookie cookie = ResponseCookie.from(name, "")
                .path(PATH)
                .httpOnly(HTTP_ONLY)
                .secure(SECURE)
                .sameSite(SAME_SITE)
                .maxAge(0)
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }
}