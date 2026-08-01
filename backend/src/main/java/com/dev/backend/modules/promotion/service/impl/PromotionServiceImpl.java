package com.dev.backend.modules.promotion.service.impl;

import com.dev.backend.modules.promotion.dto.PromotionRequest;
import com.dev.backend.modules.promotion.dto.PromotionResponse;
import com.dev.backend.modules.promotion.entity.Promotion;
import com.dev.backend.modules.promotion.mapper.PromotionMapper;
import com.dev.backend.modules.promotion.repository.PromotionRepository;
import com.dev.backend.modules.promotion.service.PromotionService;
import com.dev.backend.modules.shop.entity.Shop;
import com.dev.backend.modules.shop.repository.ShopRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class PromotionServiceImpl implements PromotionService {

    private final PromotionRepository promotionRepository;
    private final ShopRepository shopRepository;
    private final PromotionMapper promotionMapper;

    @Override
    @Transactional(readOnly = true)
    public List<PromotionResponse> getAllPromotions() {
        return promotionRepository.findAll().stream()
                .map(promotionMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public PromotionResponse getPromotionById(Long id) {
        Promotion promotion = promotionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Promotion not found with id: " + id));
        return promotionMapper.toResponse(promotion);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PromotionResponse> getPromotionsByShopId(Long shopId) {
        return promotionRepository.findByShopId(shopId).stream()
                .map(promotionMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public PromotionResponse createPromotion(PromotionRequest request) {
        Promotion promotion = promotionMapper.toEntity(request);
        if (request.getShopId() != null) {
            Shop shop = shopRepository.findById(request.getShopId())
                    .orElseThrow(() -> new RuntimeException("Shop not found with id: " + request.getShopId()));
            promotion.setShop(shop);
        }
        Promotion savedPromotion = promotionRepository.save(promotion);
        return promotionMapper.toResponse(savedPromotion);
    }

    @Override
    public PromotionResponse updatePromotion(Long id, PromotionRequest request) {
        Promotion promotion = promotionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Promotion not found with id: " + id));
        promotionMapper.updateEntityFromRequest(request, promotion);
        if (request.getShopId() != null) {
            Shop shop = shopRepository.findById(request.getShopId())
                    .orElseThrow(() -> new RuntimeException("Shop not found with id: " + request.getShopId()));
            promotion.setShop(shop);
        }
        Promotion updatedPromotion = promotionRepository.save(promotion);
        return promotionMapper.toResponse(updatedPromotion);
    }

    @Override
    public void deletePromotion(Long id) {
        if (!promotionRepository.existsById(id)) {
            throw new RuntimeException("Promotion not found with id: " + id);
        }
        promotionRepository.deleteById(id);
    }
}
