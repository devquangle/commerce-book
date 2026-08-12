package com.dev.backend.modules.others.ghn.dto;
import com.fasterxml.jackson.annotation.JsonAlias;

public record WardResponse(
        @JsonAlias("WardCode")
        String wardCode,

        @JsonAlias("WardName")
        String wardName
) {
}