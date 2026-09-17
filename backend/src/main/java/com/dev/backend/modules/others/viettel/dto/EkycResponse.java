package com.dev.backend.modules.others.viettel.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Kết quả tổng hợp sau quá trình eKYC (OCR CCCD + Face matching)
 */
@Getter 
@Setter 
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class EkycResponse {

    private String code;
    private String message;
    private InformationResponse information;
    private FaceVerificationResponse verification;
}