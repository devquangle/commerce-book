package com.dev.backend.modules.promotion_product.service.impl;

import com.dev.backend.modules.promotion_product.entity.PromotionProduct;
import com.dev.backend.modules.promotion_product.repository.PromotionProductRepository;
import com.dev.backend.modules.promotion_product.service.PromotionProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class PromotionProductServiceImpl implements PromotionProductService {

    private final PromotionProductRepository promotionProductRepository;

    @Override
    @Transactional(readOnly = true)
    public List<PromotionProduct> getAllPromotionProducts() {
        return promotionProductRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public PromotionProduct getPromotionProductById(Long id) {
        return promotionProductRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("PromotionProduct not found with id: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<PromotionProduct> getPromotionProductsByPromotionId(Long promotionId) {
        return promotionProductRepository.findByPromotionId(promotionId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PromotionProduct> getPromotionProductsByProductId(Long productId) {
        return promotionProductRepository.findByProductId(productId);
    }

    @Override
    public PromotionProduct createPromotionProduct(PromotionProduct promotionProduct) {
        return promotionProductRepository.save(promotionProduct);
    }

    @Override
    public void deletePromotionProduct(Long id) {
        if (!promotionProductRepository.existsById(id)) {
            throw new RuntimeException("PromotionProduct not found with id: " + id);
        }
        promotionProductRepository.deleteById(id);
    }
}
