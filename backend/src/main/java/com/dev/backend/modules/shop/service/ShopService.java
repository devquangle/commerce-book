package com.dev.backend.modules.shop.service;

import com.dev.backend.modules.shop.dto.RegisterShopRequest;
import com.dev.backend.modules.shop.dto.ShopResponse;
import com.dev.backend.modules.shop.entity.Shop;
import com.dev.backend.modules.user.entity.User;

import java.util.List;

public interface ShopService {

    Shop getById(Long id);

    Shop createShop(User user, RegisterShopRequest request);

    ShopResponse registerShop(RegisterShopRequest request, Long currentUserId);

    ShopResponse registerShop(RegisterShopRequest request);

    void validateRegisterShop(RegisterShopRequest request);

    boolean checkShopNameExists(String name);

    com.dev.backend.modules.shop.dto.CheckAccountResponse checkAccountAvailability(String email, String phone, Long currentUserId);

}
