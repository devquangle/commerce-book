package com.dev.backend.modules.cart.service;

import com.dev.backend.modules.cart.entity.CartItem;

import java.util.List;

public interface CartItemService {
    List<CartItem> getCartItemsByUserId(Long userId);
    CartItem getCartItemById(Long id);
    CartItem addToCart(CartItem cartItem);
    CartItem updateQuantity(Long id, Integer quantity);
    void deleteCartItem(Long id);
    void clearCart(Long userId);
}
