package com.dev.backend.modules.product.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dev.backend.common.response.PageResponse;
import com.dev.backend.common.response.ResponseData;
import com.dev.backend.common.response.ResponseUtil;
import com.dev.backend.modules.product.dto.ProductFilterRequest;
import com.dev.backend.modules.product.dto.ProductResponse;
import com.dev.backend.modules.product.service.ProductService;
import com.dev.backend.security.custom.CustomUserDetails;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1")
public class ProductController {
    private final ProductService productService;

    @GetMapping("/shop/products/filter")
    public ResponseEntity<ResponseData<PageResponse<ProductResponse>>> searchProductsByShopId(
            @ModelAttribute ProductFilterRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        PageResponse<ProductResponse> response = productService.searchProductsByShopId(request,
                userDetails.getShop().getId());
        return ResponseUtil.success("Lấy danh sách sản phẩm thành công", response);
    }

}
