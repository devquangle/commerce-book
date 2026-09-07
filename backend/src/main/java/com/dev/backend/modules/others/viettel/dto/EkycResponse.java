package com.dev.backend.modules.others.viettel.dto;

import lombok.Getter;
import lombok.Setter;

@Getter 
@Setter 
public class EkycResponse {

    private String code;
    private String message;
    private InformationResponse information;
    private FaceVerificationResponse verification;
}