package com.dev.backend.modules.others.banks.dto;

public record BankResponse(
        Integer id,
        String name,
        String shortName
) {
}