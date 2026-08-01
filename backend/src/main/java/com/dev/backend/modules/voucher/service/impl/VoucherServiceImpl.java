package com.dev.backend.modules.voucher.service.impl;

import com.dev.backend.modules.shop.entity.Shop;
import com.dev.backend.modules.shop.repository.ShopRepository;
import com.dev.backend.modules.voucher.dto.VoucherRequest;
import com.dev.backend.modules.voucher.dto.VoucherResponse;
import com.dev.backend.modules.voucher.entity.Voucher;
import com.dev.backend.modules.voucher.mapper.VoucherMapper;
import com.dev.backend.modules.voucher.repository.VoucherRepository;
import com.dev.backend.modules.voucher.service.VoucherService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class VoucherServiceImpl implements VoucherService {

    private final VoucherRepository voucherRepository;
    private final ShopRepository shopRepository;
    private final VoucherMapper voucherMapper;

    @Override
    @Transactional(readOnly = true)
    public List<VoucherResponse> getAllVouchers() {
        return voucherRepository.findAll().stream()
                .map(voucherMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public VoucherResponse getVoucherById(Long id) {
        Voucher voucher = voucherRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Voucher not found with id: " + id));
        return voucherMapper.toResponse(voucher);
    }

    @Override
    @Transactional(readOnly = true)
    public VoucherResponse getVoucherByCode(String code) {
        Voucher voucher = voucherRepository.findByCode(code)
                .orElseThrow(() -> new RuntimeException("Voucher not found with code: " + code));
        return voucherMapper.toResponse(voucher);
    }

    @Override
    @Transactional(readOnly = true)
    public List<VoucherResponse> getVouchersByShopId(Long shopId) {
        return voucherRepository.findByShopId(shopId).stream()
                .map(voucherMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public VoucherResponse createVoucher(VoucherRequest request) {
        Voucher voucher = voucherMapper.toEntity(request);
        if (request.getShopId() != null) {
            Shop shop = shopRepository.findById(request.getShopId())
                    .orElseThrow(() -> new RuntimeException("Shop not found with id: " + request.getShopId()));
            voucher.setShop(shop);
        }
        Voucher savedVoucher = voucherRepository.save(voucher);
        return voucherMapper.toResponse(savedVoucher);
    }

    @Override
    public VoucherResponse updateVoucher(Long id, VoucherRequest request) {
        Voucher voucher = voucherRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Voucher not found with id: " + id));
        voucherMapper.updateEntityFromRequest(request, voucher);
        if (request.getShopId() != null) {
            Shop shop = shopRepository.findById(request.getShopId())
                    .orElseThrow(() -> new RuntimeException("Shop not found with id: " + request.getShopId()));
            voucher.setShop(shop);
        }
        Voucher updatedVoucher = voucherRepository.save(voucher);
        return voucherMapper.toResponse(updatedVoucher);
    }

    @Override
    public void deleteVoucher(Long id) {
        if (!voucherRepository.existsById(id)) {
            throw new RuntimeException("Voucher not found with id: " + id);
        }
        voucherRepository.deleteById(id);
    }
}
