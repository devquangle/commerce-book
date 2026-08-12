package com.dev.backend.modules.others.ghn.dto;

import com.fasterxml.jackson.annotation.JsonAlias;

public record ProvinceResponse(
        @JsonAlias("ProvinceID")
        Integer provinceId,

        @JsonAlias("ProvinceName")
        String provinceName
) {
}