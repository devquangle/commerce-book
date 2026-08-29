package com.dev.backend.modules.cart.controller;

import java.util.List;

import org.checkerframework.common.reflection.qual.GetClass;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dev.backend.common.response.ResponseData;
import com.dev.backend.common.response.ResponseUtil;
import com.dev.backend.modules.cart.dto.CartResponse;
import com.dev.backend.modules.cart.service.CartItemService;
import com.dev.backend.security.custom.CustomUserDetails;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/auth")
public class CartController {

    private final CartItemService cartItemService;

    @GetMapping("/my-cart")
    public ResponseEntity<ResponseData<List<CartResponse>>> myCart(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        List<CartResponse> data = cartItemService.getCartItemsByUserId(userDetails.getUserId());
        return ResponseUtil.success("Lấy danh sách thành công", data);
    }
}
