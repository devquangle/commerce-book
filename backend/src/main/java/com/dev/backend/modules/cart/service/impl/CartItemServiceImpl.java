package com.dev.backend.modules.cart.service.impl;

import com.dev.backend.modules.cart.entity.CartItem;
import com.dev.backend.modules.cart.repository.CartItemRepository;
import com.dev.backend.modules.cart.service.CartItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class CartItemServiceImpl implements CartItemService {

    private final CartItemRepository cartItemRepository;

    @Override
    @Transactional(readOnly = true)
    public List<CartItem> getCartItemsByUserId(Long userId) {
        return cartItemRepository.findByUserId(userId);
    }

    @Override
    @Transactional(readOnly = true)
    public CartItem getCartItemById(Long id) {
        return cartItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("CartItem not found with id: " + id));
    }

    @Override
    public CartItem addToCart(CartItem cartItem) {
        if (cartItem.getUser() != null && cartItem.getProduct() != null) {
            return cartItemRepository.findByUserIdAndProductId(cartItem.getUser().getId(), cartItem.getProduct().getId())
                    .map(existing -> {
                        existing.setQuantity(existing.getQuantity() + cartItem.getQuantity());
                        return cartItemRepository.save(existing);
                    })
                    .orElseGet(() -> cartItemRepository.save(cartItem));
        }
        return cartItemRepository.save(cartItem);
    }

    @Override
    public CartItem updateQuantity(Long id, Integer quantity) {
        CartItem cartItem = getCartItemById(id);
        cartItem.setQuantity(quantity);
        return cartItemRepository.save(cartItem);
    }

    @Override
    public void deleteCartItem(Long id) {
        if (!cartItemRepository.existsById(id)) {
            throw new RuntimeException("CartItem not found with id: " + id);
        }
        cartItemRepository.deleteById(id);
    }

    @Override
    public void clearCart(Long userId) {
        cartItemRepository.deleteByUserId(userId);
    }
}
