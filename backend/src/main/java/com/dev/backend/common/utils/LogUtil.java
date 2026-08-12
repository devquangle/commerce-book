package com.dev.backend.common.utils;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public final class LogUtil {

    private LogUtil() {
    }

    public static void debug(String message, Object... args) {
        log.debug(message, args);
    }

    public static void info(String message, Object... args) {
        log.info(message, args);
    }

    public static void warn(String message, Object... args) {
        log.warn(message, args);
    }

    public static void error(String message, Object... args) {
        log.error(message, args);
    }

    public static void error(String message, Throwable throwable) {
        log.error(message, throwable);
    }
}