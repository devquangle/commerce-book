package com.dev.backend.modules.voucher.dto;

import java.time.LocalDate;

import com.dev.backend.common.enums.VoucherStatus;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VoucherFilterRequest {
    private String keyword;
    private LocalDate startDate;
    private LocalDate endDate;
    private VoucherStatus status;
    private Integer page;
    private Integer size;
}
