package com.dev.backend.common.exception;

import lombok.Getter;
@Getter
public class AppException extends RuntimeException {

    private final int code;
    private final String error;
    private final Object data;

    public AppException(int code, String message) {
        this(code, message, null, null);
    }

    public AppException(int code, String message, String error) {
        this(code, message, error, null);
    }

    public AppException(int code, String message, String error, Object data) {
        super(message);
        this.code = code;
        this.error = error;
        this.data = data;
    }
}