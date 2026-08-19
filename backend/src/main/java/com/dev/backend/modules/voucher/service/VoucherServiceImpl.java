package com.dev.backend.modules.voucher.service;

import com.dev.backend.common.enums.VoucherStatus;
import com.dev.backend.common.response.PageResponse;
import com.dev.backend.modules.shop.entity.Shop;
import com.dev.backend.modules.shop.repository.ShopRepository;
import com.dev.backend.modules.shop.service.ShopService;
import com.dev.backend.modules.voucher.dto.VoucherFilterRequest;
import com.dev.backend.modules.voucher.dto.VoucherRequest;
import com.dev.backend.modules.voucher.dto.VoucherResponse;
import com.dev.backend.modules.voucher.entity.Voucher;
import com.dev.backend.modules.voucher.mapper.VoucherMapper;
import com.dev.backend.modules.voucher.repository.VoucherRepository;

import lombok.RequiredArgsConstructor;

import org.apache.commons.lang3.StringUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class VoucherServiceImpl implements VoucherService {

    private final VoucherRepository voucherRepository;
    private final ShopService shopService;
    private final VoucherMapper voucherMapper;

    @Override
    public PageResponse<VoucherResponse> filterVouchers(VoucherFilterRequest request, Long shopId) {
        Pageable pageable = PageRequest.of(
                Math.max(0, Optional.ofNullable(request.getPage()).orElse(1) - 1),
                Optional.ofNullable(request.getSize()).filter(s -> s > 0).orElse(10),
                Sort.by(Sort.Direction.DESC, "id"));

        Page<VoucherResponse> page = voucherRepository.searchVouchersByShopId(
                StringUtils.trimToNull(request.getKeyword()),
                request.getStartDate(),
                request.getEndDate(),
                request.getStatus(),
                shopId,
                pageable).map(voucherMapper::toDTO);

        return new PageResponse<>(
                page.getContent(),
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages());
    }

    @Override
    public void insertData() {
        if (voucherRepository.count() > 0) {
            return;
        }

        List<Voucher> vouchers = new ArrayList<>();
        for (int i = 0; i <= 20; i++) {
            Voucher voucher = new Voucher();
            voucher.setName("Voucher " + i);
            voucher.setCode("VOUCHER" + String.format("%03d", i));
            voucher.setDiscountPercent(5 + i);
            voucher.setMinOrderValue(100000);
            voucher.setMaxDiscount(50000);
            voucher.setUsageLimit(100);
            voucher.setUsedCount(0);
            voucher.setStartDate(LocalDateTime.now());
            voucher.setEndDate(LocalDateTime.now().plusMonths(1));
            voucher.setShop(shopService.getById(2L));
            voucher.setStatus(VoucherStatus.ACTIVE);
            vouchers.add(voucher);
        }
        voucherRepository.saveAll(vouchers);

    }

    public static String generateVoucherCode() {
        return UUID.randomUUID()
                .toString()
                .substring(0, 8)
                .toUpperCase();
    }
}
