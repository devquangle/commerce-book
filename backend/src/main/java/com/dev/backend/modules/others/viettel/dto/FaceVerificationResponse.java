package com.dev.backend.modules.others.viettel.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class FaceVerificationResponse {

    private Integer code;
    private String message;

    @JsonProperty("requestId")
    @JsonAlias({"request_id", "requestId"})
    private String requestId;

    @JsonProperty("verifyResult")
    @JsonAlias({"verify_result", "verifyResult"})
    private String verifyResult;

    private Double score;

    @JsonProperty("verify_result")
    public String getVerifyResultSnakeCase() {
        return verifyResult;
    }

    @JsonProperty("request_id")
    public String getRequestIdSnakeCase() {
        return requestId;
    }
}
