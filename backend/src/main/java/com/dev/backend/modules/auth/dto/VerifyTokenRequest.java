package com.dev.backend.modules.auth.dto;

import jakarta.validation.constraints.NotBlank;

public record VerifyTokenRequest(
        @NotBlank(message = "Token không được bỏ trống.")
        @com.fasterxml.jackson.annotation.JsonProperty("token")
        String token
) {
}
