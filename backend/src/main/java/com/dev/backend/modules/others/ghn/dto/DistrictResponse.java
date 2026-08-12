package com.dev.backend.modules.others.ghn.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record DistrictResponse(
        @JsonProperty("DistrictID") Integer districtId,

        @JsonProperty("DistrictName") String districtName) {
}