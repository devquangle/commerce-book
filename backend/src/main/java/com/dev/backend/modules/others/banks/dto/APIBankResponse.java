package com.dev.backend.modules.others.banks.dto;

public record APIBankResponse(
        Integer id,
        String name,
        String code,
        String bin,
        String shortName,
        String logo,
        Integer transferSupported,
        Integer lookupSupported,
        String short_name,
        Integer support,
        Integer isTransfer,
        String swift_code
) {
}