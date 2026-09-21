package com.dev.backend.modules.shop.service;

import com.dev.backend.modules.shop.dto.RegisterShopRequest;
import com.dev.backend.modules.shop.dto.ShopResponse;
import com.dev.backend.modules.shop.entity.Shop;
import com.dev.backend.modules.user.entity.User;

import java.util.List;

public interface ShopService {
    List<ShopResponse> getAllShops();

    Shop getById(Long id);

    ShopResponse getShopById(Long id);

    ShopResponse getShopByOwnerId(Long ownerId);

    Shop createShop(User user,RegisterShopRequest request);


    void deleteShop(Long id);

    ShopResponse registerShop(RegisterShopRequest request);

    
}
