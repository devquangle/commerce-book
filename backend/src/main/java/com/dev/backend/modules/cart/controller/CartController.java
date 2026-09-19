package com.dev.backend.modules.cart.controller;

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

import com.dev.backend.common.exception.UnauthorizedException;
import com.dev.backend.common.response.ResponseData;
import com.dev.backend.common.response.ResponseUtil;
import com.dev.backend.modules.cart.dto.AddToCartRequest;
import com.dev.backend.modules.cart.dto.CartResponse;
import com.dev.backend.modules.cart.dto.UpdateCartItemRequest;
import com.dev.backend.modules.cart.service.CartItemService;
import com.dev.backend.security.custom.CustomUserDetails;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping({"/api/v1/cart", "/api/v1/auth/cart"})
public class CartController {

    private final CartItemService cartItemService;

    @GetMapping({"", "/my-cart"})
    public ResponseEntity<ResponseData<List<CartResponse>>> getMyCart(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        if (userDetails == null) {
            throw new UnauthorizedException("Vui lòng đăng nhập để xem giỏ hàng");
        }
        List<CartResponse> data = cartItemService.getCartItemsByUserId(userDetails.getUserId());
        return ResponseUtil.success("Lấy danh sách giỏ hàng thành công", data);
    }

    @PostMapping({"/add", "/items"})
    public ResponseEntity<ResponseData<Void>> addToCart(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody AddToCartRequest request) {
        if (userDetails == null) {
            throw new UnauthorizedException("Vui lòng đăng nhập để thêm vào giỏ hàng");
        }
        cartItemService.addToCart(userDetails.getUserId(), request);
        return ResponseUtil.successMessage("Thêm sản phẩm vào giỏ hàng thành công");
    }

    @PutMapping("/items/{id}")
    public ResponseEntity<ResponseData<Void>> updateQuantity(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable("id") Long id,
            @Valid @RequestBody UpdateCartItemRequest request) {
        if (userDetails == null) {
            throw new UnauthorizedException("Vui lòng đăng nhập để cập nhật giỏ hàng");
        }
        cartItemService.updateQuantity(userDetails.getUserId(), id, request);
        return ResponseUtil.successMessage("Cập nhật số lượng thành công");
    }

    @DeleteMapping("/items/{id}")
    public ResponseEntity<ResponseData<Void>> deleteCartItem(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable("id") Long id) {
        if (userDetails == null) {
            throw new UnauthorizedException("Vui lòng đăng nhập để xóa sản phẩm khỏi giỏ hàng");
        }
        cartItemService.deleteCartItem(userDetails.getUserId(), id);
        return ResponseUtil.successMessage("Xóa sản phẩm khỏi giỏ hàng thành công");
    }

    @DeleteMapping("/clear")
    public ResponseEntity<ResponseData<Void>> clearCart(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        if (userDetails == null) {
            throw new UnauthorizedException("Vui lòng đăng nhập để làm trống giỏ hàng");
        }
        cartItemService.clearCart(userDetails.getUserId());
        return ResponseUtil.successMessage("Đã làm trống giỏ hàng thành công");
    }
}
