package com.dev.backend.modules.promotion.service;

import com.dev.backend.common.enums.PromotionCampaignType;
import com.dev.backend.common.enums.PromotionStatus;
import com.dev.backend.modules.promotion.dto.PromotionRequest;
import com.dev.backend.modules.promotion.dto.PromotionResponse;
import com.dev.backend.modules.promotion.entity.Promotion;
import com.dev.backend.modules.promotion.mapper.PromotionMapper;
import com.dev.backend.modules.promotion.repository.PromotionRepository;
import com.dev.backend.modules.shop.entity.Shop;
import com.dev.backend.modules.shop.repository.ShopRepository;
import com.dev.backend.modules.shop.service.ShopService;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class PromotionServiceImpl implements PromotionService {

    private final PromotionRepository promotionRepository;
    private final ShopService shopService;
    private final PromotionMapper promotionMapper;

    @Override
    public void insertData() {

        if (promotionRepository.count() > 0) {
            return;
        }
        List<Promotion> promotions = new ArrayList<>();
        for (int i = 1; i <= 20; i++) {
            Promotion promotion = new Promotion();
            promotion.setName("Chương trình khuyến mãi " + i);
            promotion.setStartDate(LocalDateTime.now());
            promotion.setEndDate(LocalDateTime.now().plusDays(i + 10));
            promotion.setPromotionCampaignType(
                    i % 2 == 0
                            ? PromotionCampaignType.FLASH_SALE
                            : PromotionCampaignType.PRODUCT_DISCOUNT);
            promotion.setStatus(
                    i % 3 == 0
                            ? PromotionStatus.INACTIVE
                            : PromotionStatus.ACTIVE);
            promotion.setShop(shopService.getById(2L));
            promotions.add(promotion);
        }
        promotionRepository.saveAll(promotions);
    }
}
