package com.dev.backend.modules.cart.dto;

import com.dev.backend.modules.product.dto.response.ProductInfo;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CartItemResponse {
    private int cartItemId;
    private int quantity;
    private ProductInfo product;
    private boolean checked = false;
}
