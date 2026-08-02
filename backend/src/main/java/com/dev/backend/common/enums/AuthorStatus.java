package com.dev.backend.common.enums;

import com.dev.backend.common.exception.BadRequestException;

public enum AuthorStatus {
    ACTIVE,
    INACTIVE,
    DELETED;

    public static AuthorStatus from(String status) {
        if (status == null || status.isBlank()) {
            return null;
        }

        try {
            return AuthorStatus.valueOf(status.toUpperCase());
        } catch (Exception e) {
            throw new BadRequestException("Invalid status: " + status);
        }
    }
}
