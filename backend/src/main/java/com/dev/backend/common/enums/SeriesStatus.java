package com.dev.backend.common.enums;

import com.dev.backend.common.exception.BadRequestException;

public enum SeriesStatus {
    ACTIVE,
    INACTIVE,
    DELETED;

    public static SeriesStatus from(String status) {
        if (status == null || status.isBlank()) {
            return null;
        }

        try {
            return SeriesStatus.valueOf(status.toUpperCase());
        } catch (Exception e) {
            throw new BadRequestException("Invalid status: " + status);
        }
    }
}
