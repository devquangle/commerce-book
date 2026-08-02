package com.dev.backend.common.enums;

import com.dev.backend.common.exception.BadRequestException;

public enum PublisherStatus {
    ACTIVE,
    INACTIVE,
    DELETED;

    public static PublisherStatus from(String status) {
        if (status == null || status.isBlank()) {
            return null;
        }

        try {
            return PublisherStatus.valueOf(status.toUpperCase());
        } catch (Exception e) {
            throw new BadRequestException("Invalid status: " + status);
        }
    }
}
