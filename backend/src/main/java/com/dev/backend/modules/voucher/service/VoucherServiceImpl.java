package com.dev.backend.modules.voucher.service;

import com.dev.backend.modules.shop.entity.Shop;
import com.dev.backend.modules.shop.repository.ShopRepository;
import com.dev.backend.modules.voucher.dto.VoucherRequest;
import com.dev.backend.modules.voucher.dto.VoucherResponse;
import com.dev.backend.modules.voucher.entity.Voucher;
import com.dev.backend.modules.voucher.mapper.VoucherMapper;
import com.dev.backend.modules.voucher.repository.VoucherRepository;

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

   
}
