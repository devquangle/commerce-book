package com.dev.backend.modules.promotion_product.service;

import com.dev.backend.modules.promotion_product.dto.ProductPromotionProjection;
import com.dev.backend.modules.promotion_product.dto.ProductPromotionResponse;
import com.dev.backend.modules.promotion_product.dto.PromotionProductResponse;
import com.dev.backend.modules.promotion_product.repository.PromotionProductRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class PromotionProductServiceImpl implements PromotionProductService {

    private final PromotionProductRepository promotionProductRepository;

    @Override
    public List<ProductPromotionResponse> getByProductIds(
            List<Long> productIds) {
        return promotionProductRepository.findByProductIds(productIds)
                .stream()
                .collect(Collectors.groupingBy(
                        productPromotion -> productPromotion.productId(),
                        LinkedHashMap::new,
                        Collectors.toList()))
                .entrySet()
                .stream()
                .map(entry -> new ProductPromotionResponse(
                        entry.getKey(),
                        entry.getValue().stream()
                                .map(this::toPromotionResponse)
                                .toList()))
                .toList();
    }

    private PromotionProductResponse toPromotionResponse(
            ProductPromotionProjection projection) {
        return new PromotionProductResponse(
                projection.promotionId(),
                projection.name(),
                projection.startDate(),
                projection.endDate(),
                projection.promotionCampaignType(),
                projection.status(),
                projection.discountPercent(),
                projection.maxQuantity(),
                projection.soldQuantity(),
                projection.reservedQuantity());
    }
}
