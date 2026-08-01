package com.dev.backend.modules.voucher.mapper;

import com.dev.backend.modules.voucher.dto.VoucherRequest;
import com.dev.backend.modules.voucher.dto.VoucherResponse;
import com.dev.backend.modules.voucher.entity.Voucher;
import org.springframework.stereotype.Component;

@Component
public class VoucherMapper {

    public Voucher toEntity(VoucherRequest request) {
        if (request == null) {
            return null;
        }
        return Voucher.builder()
                .code(request.getCode())
                .title(request.getTitle())
                .description(request.getDescription())
                .discountPercent(request.getDiscountPercent())
                .minOrderValue(request.getMinOrderValue())
                .maxDiscount(request.getMaxDiscount())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .usageLimit(request.getUsageLimit())
                .usedCount(request.getUsedCount() != null ? request.getUsedCount() : 0)
                .status(request.getStatus())
                .build();
    }

    public VoucherResponse toResponse(Voucher entity) {
        if (entity == null) {
            return null;
        }
        return VoucherResponse.builder()
                .id(entity.getId())
                .shopId(entity.getShop() != null ? entity.getShop().getId() : null)
                .code(entity.getCode())
                .title(entity.getTitle())
                .description(entity.getDescription())
                .discountPercent(entity.getDiscountPercent())
                .minOrderValue(entity.getMinOrderValue())
                .maxDiscount(entity.getMaxDiscount())
                .startDate(entity.getStartDate())
                .endDate(entity.getEndDate())
                .usageLimit(entity.getUsageLimit())
                .usedCount(entity.getUsedCount())
                .status(entity.getStatus())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    public void updateEntityFromRequest(VoucherRequest request, Voucher entity) {
        if (request == null || entity == null) {
            return;
        }
        if (request.getCode() != null) {
            entity.setCode(request.getCode());
        }
        if (request.getTitle() != null) {
            entity.setTitle(request.getTitle());
        }
        if (request.getDescription() != null) {
            entity.setDescription(request.getDescription());
        }
        if (request.getDiscountPercent() != null) {
            entity.setDiscountPercent(request.getDiscountPercent());
        }
        if (request.getMinOrderValue() != null) {
            entity.setMinOrderValue(request.getMinOrderValue());
        }
        if (request.getMaxDiscount() != null) {
            entity.setMaxDiscount(request.getMaxDiscount());
        }
        if (request.getStartDate() != null) {
            entity.setStartDate(request.getStartDate());
        }
        if (request.getEndDate() != null) {
            entity.setEndDate(request.getEndDate());
        }
        if (request.getUsageLimit() != null) {
            entity.setUsageLimit(request.getUsageLimit());
        }
        if (request.getUsedCount() != null) {
            entity.setUsedCount(request.getUsedCount());
        }
        if (request.getStatus() != null) {
            entity.setStatus(request.getStatus());
        }
    }
}
