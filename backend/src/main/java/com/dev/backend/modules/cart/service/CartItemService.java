package com.dev.backend.modules.cart.service;

import com.dev.backend.modules.cart.dto.AddToCartRequest;
import com.dev.backend.modules.cart.dto.CartResponse;
import com.dev.backend.modules.cart.dto.UpdateCartItemRequest;
import com.dev.backend.modules.cart.entity.CartItem;

import java.util.List;

public interface CartItemService {
    List<CartResponse> getCartItemsByUserId(Long userId);
    CartItem getCartItemById(Long id);
    CartItem addToCart(Long userId, AddToCartRequest request);
    CartItem updateQuantity(Long userId, Long cartItemId, UpdateCartItemRequest request);
    void deleteCartItem(Long userId, Long cartItemId);
    void clearCart(Long userId);
}
