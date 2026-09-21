package com.dev.backend.modules.shop.controller;

import com.dev.backend.common.response.PageResponse;
import com.dev.backend.common.response.ResponseData;
import com.dev.backend.common.response.ResponseUtil;
import com.dev.backend.modules.shop.dto.AdminShopDetailResponse;
import com.dev.backend.modules.shop.dto.AdminShopFilterRequest;
import com.dev.backend.modules.shop.dto.AdminShopResponse;
import com.dev.backend.modules.shop.dto.RejectShopRequest;
import com.dev.backend.modules.shop.service.ShopService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin/shops")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminShopController {

    private final ShopService shopService;

    @GetMapping("/filter")
    public ResponseEntity<ResponseData<PageResponse<AdminShopResponse>>> searchShopsForAdmin(
            @ModelAttribute AdminShopFilterRequest request) {
        PageResponse<AdminShopResponse> response = shopService.searchShopsForAdmin(request);
        return ResponseUtil.success("Lấy danh sách cửa hàng thành công", response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResponseData<AdminShopDetailResponse>> getShopDetailForAdmin(
            @PathVariable("id") Long id) {
        AdminShopDetailResponse response = shopService.getShopDetailForAdmin(id);
        return ResponseUtil.success("Lấy thông tin chi tiết cửa hàng thành công", response);
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<ResponseData<Void>> approveShop(@PathVariable("id") Long id) {
        shopService.approveShop(id);
        return ResponseUtil.successMessage("Phê duyệt cửa hàng thành công.");
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<ResponseData<Void>> rejectShop(
            @PathVariable("id") Long id,
            @Valid @RequestBody RejectShopRequest request) {
        shopService.rejectShop(id, request);
        return ResponseUtil.successMessage("Từ chối phê duyệt cửa hàng thành công.");
    }
}
