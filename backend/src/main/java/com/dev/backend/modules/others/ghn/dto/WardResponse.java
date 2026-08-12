package com.dev.backend.modules.others.ghn.dto;
import com.fasterxml.jackson.annotation.JsonProperty;

public record WardResponse(
        @JsonProperty("WardCode")
        String wardCode,

        @JsonProperty("WardName")
        String wardName
) {
}