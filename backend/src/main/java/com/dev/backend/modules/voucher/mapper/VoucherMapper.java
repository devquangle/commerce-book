package com.dev.backend.modules.voucher.mapper;

import com.dev.backend.common.utils.TextUtils;
import com.dev.backend.modules.voucher.dto.VoucherRequest;
import com.dev.backend.modules.voucher.dto.VoucherResponse;
import com.dev.backend.modules.voucher.entity.Voucher;
import org.springframework.stereotype.Component;

@Component
public class VoucherMapper {

    public VoucherResponse toDTO(Voucher item) {
        if (item == null) {
            return null;
        }
        VoucherResponse response = new VoucherResponse();
        response.setId(item.getId());
        response.setName(item.getName());
        response.setCode(item.getCode());
        response.setDescription(item.getDescription());
        response.setDiscountPercent(item.getDiscountPercent());
        response.setMaxDiscount(item.getMaxDiscount());
        response.setMinOrderValue(item.getMinOrderValue());
        response.setUsageLimit(item.getUsageLimit());
        response.setUsedCount(item.getUsedCount());
        response.setStartDate(item.getStartDate());
        response.setEndDate(item.getEndDate());
        response.setStatus(item.getStatus());
        return response;
    }

    public Voucher toEntity(Voucher voucher, VoucherRequest request) {
        if (request == null) {
            return null;
        }
        voucher.setName(TextUtils.capitalizeFully(request.getName()));
        voucher.setDescription(request.getDescription());

        voucher.setDiscountPercent(request.getDiscountPercent());
        voucher.setMaxDiscount(request.getMaxDiscount());
        voucher.setMinOrderValue(request.getMinOrderValue());

        voucher.setUsageLimit(request.getUsageLimit());
        
        voucher.setStartDate(request.getStartDate());
        voucher.setEndDate(request.getEndDate());
        return voucher;
    }
}
