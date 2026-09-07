package com.dev.backend.modules.others.viettel.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class FaceVerificationResponse {

    private Integer code;
    private String message;

    @JsonProperty("request_id")
    private String requestId;

    @JsonProperty("verify_result")
    @JsonAlias({"verify_result", "verifyResult"})
    private String verifyResult;

    private Double score;
}