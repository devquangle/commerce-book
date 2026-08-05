package com.dev.backend.modules.product.dto;

import com.dev.backend.modules.shop.dto.ShopSimpleResponse;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductShopResponse {
    private Long productId;
    private ShopSimpleResponse shop;
}
