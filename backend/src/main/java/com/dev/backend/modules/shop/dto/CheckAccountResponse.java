package com.dev.backend.modules.shop.dto;

public record CheckAccountResponse(
        boolean emailExists,
        boolean phoneExists,
        boolean alreadyHasShop,
        String message
) {}
