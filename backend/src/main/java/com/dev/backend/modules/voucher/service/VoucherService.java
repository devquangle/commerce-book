package com.dev.backend.modules.voucher.service;

import com.dev.backend.common.response.PageResponse;
import com.dev.backend.modules.voucher.dto.VoucherFilterRequest;
import com.dev.backend.modules.voucher.dto.VoucherRequest;
import com.dev.backend.modules.voucher.dto.VoucherResponse;

public interface VoucherService {
    void insertData();

    void validate(VoucherRequest request);

    VoucherResponse create(VoucherRequest request, Long shopId);

    VoucherResponse update(Long id, VoucherRequest request, Long shopId);

    VoucherResponse detail(Long id, Long shopId);

    void delete(Long id, Long shopId);

    PageResponse<VoucherResponse> filterVouchers(VoucherFilterRequest request, Long shopId);
}
