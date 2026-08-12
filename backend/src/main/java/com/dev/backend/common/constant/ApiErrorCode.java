package com.dev.backend.common.constant;

public final class ApiErrorCode {

    private ApiErrorCode() {
    }

    public static final String VALIDATION_ERROR = "VALIDATION_ERROR";
    public static final String TYPE_MISMATCH = "TYPE_MISMATCH";
    public static final String ACCESS_DENIED = "ACCESS_DENIED";
    public static final String UNAUTHORIZED = "UNAUTHORIZED";
    public static final String INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR";

    public static final String NOT_FOUND = "NOT_FOUND";
    public static final String ACCOUNT_ALREADY_VERIFIED = "ACCOUNT_ALREADY_VERIFIED";
    public static final String JWT_INVALID = "JWT_INVALID";
}
