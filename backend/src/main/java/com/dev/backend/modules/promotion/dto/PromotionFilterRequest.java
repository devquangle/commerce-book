package com.dev.backend.modules.promotion.dto;

import java.time.LocalDate;

import com.dev.backend.common.enums.PromotionStatus;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PromotionFilterRequest {
    private String keyword;
    private LocalDate startDate;
    private LocalDate endDate;
    private PromotionStatus status;
    private Integer page;
    private Integer size;
}
