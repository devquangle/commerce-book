package com.dev.backend.modules.voucher.dto;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VoucherFilterRequest {
    private String keyword;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String status;
    private Integer page;
    private Integer size;
}
