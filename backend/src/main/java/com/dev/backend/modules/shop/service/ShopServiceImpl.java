package com.dev.backend.modules.shop.service;

import com.dev.backend.common.exception.BadRequestException;
import com.dev.backend.common.exception.DuplicateFieldException;
import com.dev.backend.common.utils.TextUtils;
import com.dev.backend.modules.address.service.AddressService;
import com.dev.backend.modules.shop.dto.RegisterShopRequest;
import com.dev.backend.modules.shop.dto.ShopResponse;
import com.dev.backend.modules.shop.entity.Shop;
import com.dev.backend.modules.shop.mapper.ShopMapper;
import com.dev.backend.modules.shop.repository.ShopRepository;
import com.dev.backend.modules.user.entity.User;
import com.dev.backend.modules.user.repository.UserRepository;
import com.dev.backend.modules.user.service.UserService;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ShopServiceImpl implements ShopService {

    private final ShopRepository shopRepository;
    private final UserService userService;
    private final UserRepository userRepository;
    private final AddressService addressService;
    private final ShopMapper shopMapper;

    @Override
    @Transactional(readOnly = true)
    public List<ShopResponse> getAllShops() {
        return shopRepository.findAll().stream()
                .map(shopMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Shop getById(Long id) {
        return shopRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Shop not found with id: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public ShopResponse getShopById(Long id) {
        Shop shop = shopRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Shop not found with id: " + id));
        return shopMapper.toResponse(shop);
    }

    @Override
    @Transactional(readOnly = true)
    public ShopResponse getShopByOwnerId(Long ownerId) {
        Shop shop = shopRepository.findByOwnerId(ownerId)
                .orElseThrow(() -> new RuntimeException("Shop not found for owner id: " + ownerId));
        return shopMapper.toResponse(shop);
    }

    @Override
    public Shop createShop(User user, RegisterShopRequest request) {
        Shop shop = shopMapper.toShop(user, request);
        String baseSlug = shop.getSlug();
        if (baseSlug == null || baseSlug.isBlank()) {
            baseSlug = TextUtils.toSlug(request.shopName());
        }
        String uniqueSlug = baseSlug;
        int counter = 1;
        while (shopRepository.existsBySlug(uniqueSlug)) {
            uniqueSlug = baseSlug + "-" + counter++;
        }
        shop.setSlug(uniqueSlug);
        return shopRepository.save(shop);
    }

    @Override
    public void deleteShop(Long id) {
        if (!shopRepository.existsById(id)) {
            throw new RuntimeException("Shop not found with id: " + id);
        }
        shopRepository.deleteById(id);
    }

    @Override
    public ShopResponse registerShop(RegisterShopRequest request) {
        if (request == null || request.shopName() == null || request.shopName().isBlank()) {
            throw new BadRequestException("Tên cửa hàng không được để trống.");
        }

        String trimmedShopName = request.shopName().trim();
        if (shopRepository.existsByName(trimmedShopName)) {
            throw new DuplicateFieldException("shopName", "Tên cửa hàng đã tồn tại.");
        }

        // 1. Tạo tài khoản User chủ shop
        User user = userService.createAccountShop(request);

        // 2. Tạo cửa hàng và sinh slug duy nhất
        Shop shop = createShop(user, request);

        // 3. Thiết lập quan hệ hai chiều: Gán Shop ngược lại cho User
        user.setShop(shop);
        userRepository.save(user);

        // 4. Tạo địa chỉ lấy hàng của Shop
        addressService.createShopAddress(user, request);

        // 5. Trả về response thông tin Shop vừa tạo
        return shopMapper.toResponse(shop);
    }
}
