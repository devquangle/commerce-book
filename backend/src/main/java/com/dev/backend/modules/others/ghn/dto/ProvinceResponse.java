package com.dev.backend.modules.others.ghn.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record ProvinceResponse(
        @JsonProperty("ProvinceID")
        Integer provinceId,

        @JsonProperty("ProvinceName")
        String provinceName
) {
}