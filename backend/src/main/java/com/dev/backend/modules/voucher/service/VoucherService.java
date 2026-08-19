package com.dev.backend.modules.voucher.service;

import com.dev.backend.common.response.PageResponse;
import com.dev.backend.modules.voucher.dto.VoucherFilterRequest;
import com.dev.backend.modules.voucher.dto.VoucherRequest;
import com.dev.backend.modules.voucher.dto.VoucherResponse;
import com.dev.backend.modules.voucher.entity.Voucher;
import java.util.List;

public interface VoucherService {
    void insertData();

    //VoucherResponse add(Voucher voucher, VoucherRequest request, Integer shopId);

    PageResponse<VoucherResponse> filterVouchers(VoucherFilterRequest request,Integer shopId);
}
