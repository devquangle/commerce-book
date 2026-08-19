package com.dev.backend.modules.promotion_product.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dev.backend.common.response.ResponseData;
import com.dev.backend.common.response.ResponseUtil;
import com.dev.backend.modules.promotion_product.dto.ProductPromotionRequest;
import com.dev.backend.modules.promotion_product.dto.ProductPromotionResponse;
import com.dev.backend.modules.promotion_product.service.PromotionProductService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class PromotionProductController {
    private final PromotionProductService promotionProductService;

    @PostMapping("/shop/promotions/products")
    public ResponseEntity<ResponseData<List<ProductPromotionResponse>>> getPromotionsByProductIds(
            @RequestBody ProductPromotionRequest request) {
        List<ProductPromotionResponse> items = promotionProductService.getByProductIds(request.getProductIds());
        return ResponseUtil.success("Load data success", items);
    }
}
