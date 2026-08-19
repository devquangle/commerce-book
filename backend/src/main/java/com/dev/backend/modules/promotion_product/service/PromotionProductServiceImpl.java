package com.dev.backend.modules.promotion_product.service;

import com.dev.backend.common.enums.PromotionStatus;
import com.dev.backend.modules.product.repository.ProductRepository;
import com.dev.backend.modules.promotion.dto.ProductPromotion;
import com.dev.backend.modules.promotion.entity.Promotion;
import com.dev.backend.modules.promotion_product.dto.ProductPromotionProjection;
import com.dev.backend.modules.promotion_product.dto.ProductPromotionResponse;
import com.dev.backend.modules.promotion_product.dto.PromotionProductResponse;
import com.dev.backend.modules.promotion_product.entity.PromotionProduct;
import com.dev.backend.modules.promotion_product.repository.PromotionProductRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class PromotionProductServiceImpl implements PromotionProductService {

        private final PromotionProductRepository promotionProductRepository;
        private final ProductRepository productRepository;

        @Override
        public void setPromotionProducts(
                        Promotion promotion,
                        List<ProductPromotion> productPromotions) {
                List<PromotionProduct> promotionProducts = productPromotions.stream()
                                .map(item -> {
                                        PromotionProduct promotionProduct = new PromotionProduct();

                                        promotionProduct.setPromotion(promotion);
                                        promotionProduct.setProduct(
                                                        productRepository.getReferenceById(item.getProductId()));
                                        promotionProduct.setDiscountPercent(item.getDiscountPercent());
                                        promotionProduct.setMaxQuantity(item.getMaxQuantity());
                                        promotionProduct.setSoldQuantity(0);
                                        promotionProduct.setReservedQuantity(0);

                                        return promotionProduct;
                                })
                                .toList();

                promotionProductRepository.saveAll(promotionProducts);
        }

        @Override
        public List<ProductPromotionResponse> getByProductIds(List<Long> productIds) {

                LocalDateTime now = LocalDateTime.now();

                return promotionProductRepository.findByProductIds(productIds)
                                .stream()
                                .collect(Collectors.groupingBy(
                                                projection -> projection.productId(),
                                                LinkedHashMap::new,
                                                Collectors.toList()))
                                .entrySet()
                                .stream()
                                .map(entry -> {

                                        List<PromotionProductResponse> promotions = entry.getValue()
                                                        .stream()
                                                        .map(this::toPromotionResponse)
                                                        .toList();

                                        // Promotion đang active và có discount cao nhất
                                        PromotionProductResponse activePromotion = promotions.stream()
                                                        .filter(promotion -> promotion
                                                                        .status() == PromotionStatus.ACTIVE
                                                                        && !promotion.startDate().isAfter(now)
                                                                        && !promotion.endDate().isBefore(now))
                                                        .max(Comparator.comparing(
                                                                        promotion -> promotion.discountPercent(),
                                                                        Comparator.nullsFirst(
                                                                                        Comparator.naturalOrder())))
                                                        .orElse(null);

                                        // History không bao gồm promotion đang active
                                        List<PromotionProductResponse> history = promotions.stream()
                                                        .filter(promotion -> activePromotion == null
                                                                        || !Objects.equals(
                                                                                        promotion.promotionId(),
                                                                                        activePromotion.promotionId()))
                                                        .toList();

                                        return new ProductPromotionResponse(
                                                        entry.getKey(),
                                                        activePromotion,
                                                        history);
                                })
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
