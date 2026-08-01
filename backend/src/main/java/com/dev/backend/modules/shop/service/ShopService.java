package com.dev.backend.modules.shop.service;

import com.dev.backend.modules.shop.dto.ShopRequest;
import com.dev.backend.modules.shop.dto.ShopResponse;

import java.util.List;

public interface ShopService {
    List<ShopResponse> getAllShops();
    ShopResponse getShopById(Long id);
    ShopResponse getShopByOwnerId(Long ownerId);
    ShopResponse createShop(ShopRequest request);
    ShopResponse updateShop(Long id, ShopRequest request);
    void deleteShop(Long id);
}
