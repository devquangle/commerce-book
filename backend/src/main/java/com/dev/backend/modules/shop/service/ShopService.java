package com.dev.backend.modules.shop.service;

import com.dev.backend.modules.shop.dto.CheckAccountResponse;
import com.dev.backend.modules.shop.dto.RegisterShopRequest;
import com.dev.backend.modules.shop.dto.ShopResponse;
import com.dev.backend.modules.shop.entity.Shop;
import com.dev.backend.modules.user.entity.User;


import com.dev.backend.common.response.PageResponse;
import com.dev.backend.modules.shop.dto.AdminShopDetailResponse;
import com.dev.backend.modules.shop.dto.AdminShopFilterRequest;
import com.dev.backend.modules.shop.dto.AdminShopResponse;
import com.dev.backend.modules.shop.dto.RejectShopRequest;

public interface ShopService {

    Shop getById(Long id);

    Shop createShop(User user, RegisterShopRequest request);

    ShopResponse registerShop(RegisterShopRequest request, Long currentUserId);

    ShopResponse registerShop(RegisterShopRequest request);

    void validateRegisterShop(RegisterShopRequest request);

    boolean checkShopNameExists(String name);

    CheckAccountResponse checkAccountAvailability(String email, String phone, Long currentUserId);

    PageResponse<AdminShopResponse> searchShopsForAdmin(AdminShopFilterRequest request);

    AdminShopDetailResponse getShopDetailForAdmin(Long id);

    void approveShop(Long id);

    void rejectShop(Long id, RejectShopRequest request);
}
