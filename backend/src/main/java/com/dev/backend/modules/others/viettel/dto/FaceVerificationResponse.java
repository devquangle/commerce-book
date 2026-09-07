package com.dev.backend.modules.others.viettel.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FaceVerificationResponse {

    private String verifyResult;
    private Double score;
}