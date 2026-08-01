package com.dev.backend.modules.shop.service.impl;

import com.dev.backend.modules.shop.dto.ShopRequest;
import com.dev.backend.modules.shop.dto.ShopResponse;
import com.dev.backend.modules.shop.entity.Shop;
import com.dev.backend.modules.shop.mapper.ShopMapper;
import com.dev.backend.modules.shop.repository.ShopRepository;
import com.dev.backend.modules.shop.service.ShopService;
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
    public ShopResponse createShop(ShopRequest request) {
        Shop shop = shopMapper.toEntity(request);
        Shop savedShop = shopRepository.save(shop);
        return shopMapper.toResponse(savedShop);
    }

    @Override
    public ShopResponse updateShop(Long id, ShopRequest request) {
        Shop shop = shopRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Shop not found with id: " + id));
        shopMapper.updateEntityFromRequest(request, shop);
        Shop updatedShop = shopRepository.save(shop);
        return shopMapper.toResponse(updatedShop);
    }

    @Override
    public void deleteShop(Long id) {
        if (!shopRepository.existsById(id)) {
            throw new RuntimeException("Shop not found with id: " + id);
        }
        shopRepository.deleteById(id);
    }
}
