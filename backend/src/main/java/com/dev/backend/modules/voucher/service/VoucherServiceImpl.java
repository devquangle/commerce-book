package com.dev.backend.modules.voucher.service;

import com.dev.backend.common.enums.VoucherStatus;
import com.dev.backend.common.exception.BadRequestException;
import com.dev.backend.common.exception.DuplicateFieldException;
import com.dev.backend.common.exception.NotFoundException;
import com.dev.backend.common.response.PageResponse;
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
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

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

        LocalDateTime startDate = request.getStartDate() != null
                ? request.getStartDate().atStartOfDay()
                : null;

        LocalDateTime endDate = request.getEndDate() != null
                ? request.getEndDate()
                        .plusDays(1)
                        .atStartOfDay()
                : null;

        Page<VoucherResponse> page = voucherRepository.searchVouchersByShopId(
                StringUtils.trimToNull(request.getKeyword()),
                startDate,
                endDate,
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
    public void validate(VoucherRequest request) {
        DuplicateFieldException errors = new DuplicateFieldException(new HashMap<>());
        if (voucherRepository.existsByCode(request.getCode())) {
            errors.addError("code", "Mã code đã được dùng.");
        }
        if (!errors.getErrors().isEmpty()) {
            throw errors;
        }
    }

    @Override
    public VoucherResponse create(VoucherRequest request, Long shopId) {
        Voucher voucher = new Voucher();
        validate(request);
        voucherMapper.toEntity(voucher, request);
        voucher.setCode(request.getCode().toUpperCase());
        voucher.setUsedCount(0);
        voucher.setShop(shopService.getById(shopId));
        voucher.setStatus(VoucherStatus.ACTIVE);
        return voucherMapper.toDTO(voucherRepository.save(voucher));
    }

    @Override
    public VoucherResponse detail(Long id, Long shopId) {
        Voucher voucher = voucherRepository.findByIdAndShopId(id, shopId)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy."));
        return voucherMapper.toDTO(voucher);
    }

    @Override
    public VoucherResponse update(Long id, VoucherRequest request, Long shopId) {
        Voucher voucher = voucherRepository.findByIdAndShopId(id, shopId)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy."));
        if (voucher.getStatus() == VoucherStatus.DELETE) {
            throw new BadRequestException(
                    "Voucher đã bị xóa, không thể cập nhật.");
        }
        if (!voucher.getEndDate().isAfter(LocalDateTime.now())) {
            throw new BadRequestException("Voucher đã hết hạn, không thể cập nhật.");
        }
        // Chỉ cho phép ACTIVE <-> INACTIVE
        if (request.getStatus() != VoucherStatus.ACTIVE
                && request.getStatus() != VoucherStatus.INACTIVE) {
            throw new BadRequestException(
                    "Trạng thái chỉ được ACTIVE hoặc INACTIVE.");
        }
        voucherMapper.toEntity(voucher, request);
        voucher.setStatus(request.getStatus());
        return voucherMapper.toDTO(voucherRepository.save(voucher));
    }

    @Override
    public void delete(Long id, Long shopId) {
        Voucher voucher = voucherRepository.findByIdAndShopId(id, shopId)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy."));
        voucher.setStatus(VoucherStatus.DELETE);
        voucherRepository.save(voucher);

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
