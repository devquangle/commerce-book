package com.dev.backend.modules.user.service;

import com.dev.backend.modules.shop.dto.RegisterShopRequest;
import com.dev.backend.modules.user.entity.User;


public interface UserService {

    void insertData();

    void validateAccountShop(RegisterShopRequest req);

    User createAccountShop(RegisterShopRequest req);

    User updateAccountShop(User user, RegisterShopRequest req);

}
