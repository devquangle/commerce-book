package com.dev.backend.modules.promotion.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dev.backend.common.response.PageResponse;
import com.dev.backend.common.response.ResponseData;
import com.dev.backend.common.response.ResponseUtil;
import com.dev.backend.modules.promotion.dto.PromotionFilterRequest;
import com.dev.backend.modules.promotion.dto.PromotionResponse;
import com.dev.backend.modules.promotion.service.PromotionService;

import com.dev.backend.security.custom.CustomUserDetails;

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
}
