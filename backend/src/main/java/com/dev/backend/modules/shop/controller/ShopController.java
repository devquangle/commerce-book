package com.dev.backend.modules.shop.controller;

import com.dev.backend.common.response.ResponseData;
import com.dev.backend.common.response.ResponseUtil;
import com.dev.backend.modules.shop.dto.RegisterShopRequest;
import com.dev.backend.modules.shop.dto.ShopResponse;
import com.dev.backend.modules.shop.service.ShopService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/shops")
@RequiredArgsConstructor
public class ShopController {

    private final ShopService shopService;

    @PostMapping("/register")
    public ResponseEntity<ResponseData<ShopResponse>> registerShop(@RequestBody @Valid RegisterShopRequest request) {
        ShopResponse response = shopService.registerShop(request);
        return ResponseUtil.success("Đăng ký mở cửa hàng thành công.", response);
    }
}
