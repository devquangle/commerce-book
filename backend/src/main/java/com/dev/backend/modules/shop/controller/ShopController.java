package com.dev.backend.modules.shop.controller;

import com.dev.backend.common.response.ResponseData;
import com.dev.backend.common.response.ResponseUtil;
import com.dev.backend.modules.shop.dto.RegisterShopRequest;
import com.dev.backend.modules.shop.dto.ShopResponse;
import com.dev.backend.modules.shop.service.ShopService;
import com.dev.backend.security.custom.CustomUserDetails;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/shops")
@RequiredArgsConstructor
public class ShopController {

    private final ShopService shopService;

    @PostMapping("/register")
    public ResponseEntity<ResponseData<ShopResponse>> registerShop(
            @RequestBody @Valid RegisterShopRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        Long currentUserId = userDetails != null ? userDetails.getUserId() : null;
        ShopResponse response = shopService.registerShop(request, currentUserId);
        return ResponseUtil.success("Đăng ký mở cửa hàng thành công.", response);
    }

    @GetMapping("/check-name")
    public ResponseEntity<ResponseData<Boolean>> checkShopName(@RequestParam String name) {
        boolean exists = shopService.checkShopNameExists(name);
        return ResponseUtil.success("Kiểm tra tên cửa hàng", exists);
    }

    @GetMapping("/check-account")
    public ResponseEntity<ResponseData<com.dev.backend.modules.shop.dto.CheckAccountResponse>> checkAccount(
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String phone,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        Long currentUserId = userDetails != null ? userDetails.getUserId() : null;
        com.dev.backend.modules.shop.dto.CheckAccountResponse response = shopService.checkAccountAvailability(email, phone, currentUserId);
        return ResponseUtil.success("Kiểm tra thông tin tài khoản", response);
    }
}
