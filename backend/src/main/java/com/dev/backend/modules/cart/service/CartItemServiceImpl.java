package com.dev.backend.modules.cart.service;

import com.dev.backend.modules.cart.dto.CartItemResponse;
import com.dev.backend.modules.cart.dto.CartResponse;
import com.dev.backend.modules.cart.entity.CartItem;
import com.dev.backend.modules.cart.repository.CartItemRepository;
import com.dev.backend.modules.product.mapper.ProductMapper;
import com.dev.backend.modules.product.service.ProductService;
import com.dev.backend.modules.shop.entity.Shop;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional
public class CartItemServiceImpl implements CartItemService {

    private final CartItemRepository cartItemRepository;
    private final ProductService productService;
  @Override
@Transactional(readOnly = true)
public List<CartResponse> getCartItemsByUserId(Long userId) {

    List<CartItem> cartItems = cartItemRepository.findByUserId(userId);

    if (cartItems == null || cartItems.isEmpty()) {
        return Collections.emptyList();
    }

    Map<Long, CartResponse> shopMap = new LinkedHashMap<>();

    for (CartItem cartItem : cartItems) {

        Shop shop = cartItem.getProduct().getShop();

        CartResponse cartResponse = shopMap.computeIfAbsent(
            shop.getId(),
            key -> {
                CartResponse response = new CartResponse();
                response.setShopId(shop.getId().intValue());
                response.setShopName(shop.getName());
                response.setShopSlug(shop.getSlug());
                response.setChecked(false);
                return response;
            }
        );

        CartItemResponse itemResponse = new CartItemResponse();
        itemResponse.setCartItemId(cartItem.getId().intValue());
        itemResponse.setQuantity(cartItem.getQuantity());
        itemResponse.setChecked(false);
        itemResponse.setProduct(productService.maProductInfo(cartItem.getProduct()));
        cartResponse.getItems().add(itemResponse);
    }

    return new ArrayList<>(shopMap.values());
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
