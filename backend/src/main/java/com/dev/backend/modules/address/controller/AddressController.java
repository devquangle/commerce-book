package com.dev.backend.modules.address.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dev.backend.common.response.ResponseData;
import com.dev.backend.common.response.ResponseUtil;
import com.dev.backend.modules.address.dto.AddressRequest;
import com.dev.backend.modules.address.dto.AddressResponse;
import com.dev.backend.modules.address.service.AddressService;
import com.dev.backend.security.custom.CustomUserDetails;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/user")
@RequiredArgsConstructor
public class AddressController {

    private final AddressService addressService;

    @GetMapping("/address")
    public ResponseEntity<ResponseData<List<AddressResponse>>> getAddressByUserId(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        List<AddressResponse> items = addressService.getByUserId(userDetails.getUserId());
        return ResponseUtil.success("Lấy danh địa chỉ thành công", items);
    }

    @GetMapping("/address/{id}")
    public ResponseEntity<ResponseData<AddressResponse>> getById(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        AddressResponse item = addressService.detail(id, userDetails.getUserId());
        return ResponseUtil.success("Lấy chi tiết địa chỉ thành công", item);
    }

    @PostMapping("/address")
    public ResponseEntity<ResponseData<AddressResponse>> create(
            @Valid @RequestBody AddressRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        AddressResponse item = addressService.create(request, userDetails.getUserId());
        return ResponseUtil.success("Thêm địa chỉ thành công", item);
    }

    @PutMapping("/address/{id}")
    public ResponseEntity<ResponseData<AddressResponse>> update(
            @PathVariable Long id,
            @Valid @RequestBody AddressRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        AddressResponse item = addressService.update(id, request, userDetails.getUserId());
        return ResponseUtil.success("Cập nhật địa chỉ thành công", item);
    }

    @PutMapping("/address/{id}/default")
    public ResponseEntity<ResponseData<Void>> defaultAddress(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        addressService.defaultAddress(id, userDetails.getUserId());
        return ResponseUtil.successMessage("Cập nhật địa chỉ thành công");
    }

    @DeleteMapping("/address/{id}")
    public ResponseEntity<ResponseData<Void>> delete(@PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        addressService.delete(id, userDetails.getUserId());
        return ResponseUtil.successMessage("Xóa địa chỉ thành công");
    }
}