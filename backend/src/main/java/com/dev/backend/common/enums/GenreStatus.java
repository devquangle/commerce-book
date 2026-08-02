package com.dev.backend.common.enums;

import com.dev.backend.common.exception.BadRequestException;

public enum GenreStatus {
    ACTIVE,
    INACTIVE,
    DELETED;

    public static GenreStatus from(String status) {
        if (status == null || status.isBlank()) {
            return null;
        }

        try {
            return GenreStatus.valueOf(status.toUpperCase());
        } catch (Exception e) {
            throw new BadRequestException("Invalid status: " + status);
        }
    }
}
