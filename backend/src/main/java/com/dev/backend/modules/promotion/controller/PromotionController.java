package com.dev.backend.modules.promotion.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dev.backend.common.response.PageResponse;
import com.dev.backend.common.response.ResponseData;
import com.dev.backend.common.response.ResponseUtil;
import com.dev.backend.modules.promotion.dto.PromotionFilterRequest;
import com.dev.backend.modules.promotion.dto.PromotionRequest;
import com.dev.backend.modules.promotion.dto.PromotionResponse;
import com.dev.backend.modules.promotion.service.PromotionService;
import com.dev.backend.modules.voucher.dto.VoucherRequest;
import com.dev.backend.modules.voucher.dto.VoucherResponse;
import com.dev.backend.security.custom.CustomUserDetails;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class PromotionController {
    private final PromotionService promotionService;

    @GetMapping("/shop/promotions/filter")
    public ResponseEntity<ResponseData<PageResponse<PromotionResponse>>> search(
            @ModelAttribute PromotionFilterRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        PageResponse<PromotionResponse> data = promotionService.filterPromotions(request,
                userDetails.getShop().getId());
        return ResponseUtil.success("Load promotion success", data);
    }

    @PostMapping("/shop/promotions")
    public ResponseEntity<ResponseData<PromotionResponse>> create(
            @RequestBody @Valid PromotionRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        PromotionResponse data = promotionService.create(request, userDetails.getShop().getId());
        return ResponseUtil.success("Create promotion success", data);
    }

    @GetMapping("/shop/promotions/{id}")
    public ResponseEntity<ResponseData<PromotionResponse>> detail(
            @PathVariable("id") Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        PromotionResponse data = promotionService.detail(id, userDetails.getShop().getId());
        return ResponseUtil.success("Detail promotion success", data);
    }

    @DeleteMapping("/shop/promotions/{id}")
    public ResponseEntity<ResponseData<Void>> delete(
            @PathVariable("id") Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        promotionService.delete(id, userDetails.getShop().getId());
        return ResponseUtil.successMessage("Delete promotion success");
    }
}
