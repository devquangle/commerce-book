package com.dev.backend.modules.others.viettel.dto;

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
public class ViettelIdCardResponse {

    private Integer code;
    private String message;

    @JsonProperty("request_id")
    private String requestId;

    private InformationResponse information;
}