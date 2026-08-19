package com.dev.backend.modules.voucher.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

import com.dev.backend.common.enums.VoucherStatus;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class VoucherRequest {

    private String code;
    private String name;
    private String description;
    
    private Integer discountPercent;
    private Integer minOrderValue;
    private Integer maxDiscount;

    private Integer usageLimit;
    private Integer usedCount;

    private LocalDateTime startDate;
    private LocalDateTime endDate;

    private VoucherStatus status;
}
