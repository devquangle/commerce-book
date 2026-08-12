package com.dev.backend.modules.others.ghn.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CalculateFeeRequest {
    private String toWardCode;
    private Integer toDistrictId;
    private Integer weight;
}
