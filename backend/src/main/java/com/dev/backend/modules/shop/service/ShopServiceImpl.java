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

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import com.dev.backend.common.exception.NotFoundException;

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
    public Shop getById(Long id) {
        return shopRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Cửa hàng không tồn tại với id: " + id));
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
    public boolean checkShopNameExists(String name) {
        if (name == null || name.isBlank()) {
            return false;
        }
        return shopRepository.existsByName(name.trim());
    }

    @Override
    @Transactional(readOnly = true)
    public com.dev.backend.modules.shop.dto.CheckAccountResponse checkAccountAvailability(String email, String phone, Long currentUserId) {
        boolean emailExists = false;
        boolean phoneExists = false;
        boolean alreadyHasShop = false;
        StringBuilder message = new StringBuilder();

        if (currentUserId != null) {
            User currentUser = userRepository.findById(currentUserId).orElse(null);
            if (currentUser != null) {
                if (currentUser.getShop() != null) {
                    alreadyHasShop = true;
                    message.append("Tài khoản của bạn đã sở hữu một cửa hàng. ");
                }
                if (phone != null && !phone.isBlank() && !phone.trim().equals(currentUser.getPhone())) {
                    if (userRepository.existsByPhone(phone.trim())) {
                        phoneExists = true;
                        message.append("Số điện thoại này đã được sử dụng bởi tài khoản khác. ");
                    }
                }
            }
        } else {
            if (email != null && !email.isBlank()) {
                if (userRepository.existsByEmail(email.trim())) {
                    emailExists = true;
                    message.append("Email này đã được sử dụng. ");
                }
            }
            if (phone != null && !phone.isBlank()) {
                if (userRepository.existsByPhone(phone.trim())) {
                    phoneExists = true;
                    message.append("Số điện thoại này đã được sử dụng. ");
                }
            }
        }

        return new com.dev.backend.modules.shop.dto.CheckAccountResponse(
                emailExists,
                phoneExists,
                alreadyHasShop,
                message.toString().trim()
        );
    }

    @Override
    public void validateRegisterShop(RegisterShopRequest request) {
        if (request == null) {
            throw new BadRequestException("Dữ liệu đăng ký không được để trống.");
        }
        if (request.shopName() == null || request.shopName().isBlank()) {
            throw new BadRequestException("Tên cửa hàng không được để trống.");
        }
        String trimmedShopName = request.shopName().trim();
        if (shopRepository.existsByName(trimmedShopName)) {
            throw new DuplicateFieldException("shopName", "Tên cửa hàng đã tồn tại trên hệ thống.");
        }
    }

    @Override
    public ShopResponse registerShop(RegisterShopRequest request) {
        return registerShop(request, null);
    }

    @Override
    public ShopResponse registerShop(RegisterShopRequest request, Long currentUserId) {
        // 0. Kiểm tra tính hợp lệ của shop
        validateRegisterShop(request);

        User user;
        if (currentUserId != null) {
            // Trường hợp 1: Người dùng đã đăng nhập tài khoản
            user = userRepository.findById(currentUserId)
                    .orElseThrow(() -> new NotFoundException("Không tìm thấy thông tin tài khoản người dùng"));

            if (user.getShop() != null) {
                throw new BadRequestException("Tài khoản của bạn đã đăng ký sở hữu một cửa hàng.");
            }

            user = userService.updateAccountShop(user, request);
        } else {
            // Trường hợp 2: Khách vãng lai (Guest) chưa đăng nhập
            userService.validateAccountShop(request);
            user = userService.createAccountShop(request);
        }

        // 1. Tạo cửa hàng và sinh slug duy nhất
        Shop shop = createShop(user, request);

        // 2. Thiết lập quan hệ hai chiều: Gán Shop ngược lại cho User
        user.setShop(shop);
        shop.setYear(LocalDate.now().getYear());
        userRepository.save(user);

        // 3. Tạo địa chỉ lấy hàng của Shop
        addressService.createShopAddress(user, request);

        // 4. Trả về response thông tin Shop vừa tạo
        return shopMapper.toResponse(shop);
    }
}
