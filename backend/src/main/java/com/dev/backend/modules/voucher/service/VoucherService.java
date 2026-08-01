package com.dev.backend.modules.voucher.service;

import com.dev.backend.modules.voucher.dto.VoucherRequest;
import com.dev.backend.modules.voucher.dto.VoucherResponse;

import java.util.List;

public interface VoucherService {
    List<VoucherResponse> getAllVouchers();
    VoucherResponse getVoucherById(Long id);
    VoucherResponse getVoucherByCode(String code);
    List<VoucherResponse> getVouchersByShopId(Long shopId);
    VoucherResponse createVoucher(VoucherRequest request);
    VoucherResponse updateVoucher(Long id, VoucherRequest request);
    void deleteVoucher(Long id);
}
