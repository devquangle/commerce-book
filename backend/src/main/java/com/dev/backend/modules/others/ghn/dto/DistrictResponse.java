package com.dev.backend.modules.others.ghn.dto;

import com.fasterxml.jackson.annotation.JsonAlias;

public record DistrictResponse(
        @JsonAlias("DistrictID") Integer districtId,

        @JsonAlias("DistrictName") String districtName) {
}