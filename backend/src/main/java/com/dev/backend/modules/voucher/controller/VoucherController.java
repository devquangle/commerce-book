package com.dev.backend.modules.voucher.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dev.backend.common.response.PageResponse;
import com.dev.backend.common.response.ResponseData;
import com.dev.backend.common.response.ResponseUtil;
import com.dev.backend.modules.voucher.dto.VoucherFilterRequest;
import com.dev.backend.modules.voucher.dto.VoucherRequest;
import com.dev.backend.modules.voucher.dto.VoucherResponse;
import com.dev.backend.modules.voucher.service.VoucherService;
import com.dev.backend.security.custom.CustomUserDetails;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class VoucherController {
    private final VoucherService voucherService;

    @GetMapping("/shop/vouchers/filter")
    public ResponseEntity<ResponseData<PageResponse<VoucherResponse>>> search(
            @ModelAttribute VoucherFilterRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        PageResponse<VoucherResponse> data = voucherService.filterVouchers(request, userDetails.getShop().getId());
        return ResponseUtil.success("Load voucher success", data);
    }

    @PostMapping("/shop/vouchers")
    public ResponseEntity<ResponseData<VoucherResponse>> create(
            @RequestBody @Valid VoucherRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        VoucherResponse data = voucherService.create(request, userDetails.getShop().getId());
        return ResponseUtil.success("Create voucher success", data);
    }

    @PutMapping("/shop/vouchers/{id}")
    public ResponseEntity<ResponseData<VoucherResponse>> update(
            @PathVariable("id") Long id,
            @RequestBody @Valid VoucherRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        VoucherResponse data = voucherService.update(id, request, userDetails.getShop().getId());
        return ResponseUtil.success("Update voucher success", data);
    }

    @GetMapping("/shop/vouchers/{id}")
    public ResponseEntity<ResponseData<VoucherResponse>> detail(
            @PathVariable("id") Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        VoucherResponse data = voucherService.detail(id, userDetails.getShop().getId());
        return ResponseUtil.success("Get voucher success", data);
    }

    @DeleteMapping("/shop/vouchers/{id}")
    public ResponseEntity<ResponseData<Void>> delete(
            @PathVariable("id") Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        voucherService.delete(id, userDetails.getShop().getId());
        return ResponseUtil.successMessage("Delete voucher success");
    }
}
