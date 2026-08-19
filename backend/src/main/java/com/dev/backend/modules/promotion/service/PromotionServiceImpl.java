package com.dev.backend.modules.promotion.service;

import com.dev.backend.common.enums.PromotionCampaignType;
import com.dev.backend.common.enums.PromotionStatus;
import com.dev.backend.common.exception.NotFoundException;
import com.dev.backend.common.response.PageResponse;
import com.dev.backend.modules.promotion.dto.PromotionFilterRequest;
import com.dev.backend.modules.promotion.dto.PromotionResponse;
import com.dev.backend.modules.promotion.entity.Promotion;
import com.dev.backend.modules.promotion.mapper.PromotionMapper;
import com.dev.backend.modules.promotion.repository.PromotionRepository;
import com.dev.backend.modules.shop.service.ShopService;

import lombok.RequiredArgsConstructor;

import org.apache.commons.lang3.StringUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class PromotionServiceImpl implements PromotionService {

        private final PromotionRepository promotionRepository;
        private final ShopService shopService;
        private final PromotionMapper promotionMapper;

        @Override
        public void delete(Long id, Long shopId) {
                Promotion promotion = promotionRepository.findByIdAndShopId(id, shopId)
                                .orElseThrow(() -> new NotFoundException("Không tìm thấy"));
                promotion.setStatus(PromotionStatus.DELETED);
                promotionRepository.save(promotion);
        }

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

        @Override
        public PageResponse<PromotionResponse> filterPromotions(PromotionFilterRequest request, Long shopId) {
                Pageable pageable = PageRequest.of(
                                Math.max(0, Optional.ofNullable(request.getPage()).orElse(1) - 1),
                                Optional.ofNullable(request.getSize()).filter(s -> s > 0).orElse(10),
                                Sort.by(Sort.Direction.DESC, "id"));

                LocalDateTime startDate = request.getStartDate() != null
                                ? request.getStartDate().atStartOfDay()
                                : null;

                LocalDateTime endDate = request.getEndDate() != null
                                ? request.getEndDate()
                                                .plusDays(1)
                                                .atStartOfDay()
                                : null;

                Page<PromotionResponse> page = promotionRepository.searchPromotionsByShopId(
                                StringUtils.trimToNull(request.getKeyword()),
                                startDate,
                                endDate,
                                request.getStatus(),
                                shopId,
                                pageable).map(promotionMapper::toDTO);

                return new PageResponse<>(
                                page.getContent(),
                                page.getNumber(),
                                page.getSize(),
                                page.getTotalElements(),
                                page.getTotalPages());
        }
}
