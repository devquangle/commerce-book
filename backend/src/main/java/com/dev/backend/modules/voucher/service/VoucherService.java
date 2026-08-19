package com.dev.backend.modules.voucher.service;

import com.dev.backend.modules.voucher.dto.VoucherRequest;
import com.dev.backend.modules.voucher.dto.VoucherResponse;
import com.dev.backend.modules.voucher.entity.Voucher;
import java.util.List;

public interface VoucherService {
    void insertData();

    //VoucherResponse add(Voucher voucher, VoucherRequest request, Integer shopId);
}
