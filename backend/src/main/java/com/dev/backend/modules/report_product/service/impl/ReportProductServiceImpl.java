package com.dev.backend.modules.report_product.service.impl;

import com.dev.backend.modules.report_product.entity.ReportProduct;
import com.dev.backend.modules.report_product.repository.ReportProductRepository;
import com.dev.backend.modules.report_product.service.ReportProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ReportProductServiceImpl implements ReportProductService {

    private final ReportProductRepository reportProductRepository;

    @Override
    @Transactional(readOnly = true)
    public List<ReportProduct> getAllReportProducts() {
        return reportProductRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public ReportProduct getReportProductById(Long id) {
        return reportProductRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ReportProduct not found with id: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReportProduct> getReportProductsByProductId(Long productId) {
        return reportProductRepository.findByProductId(productId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReportProduct> getReportProductsByUserId(Long userId) {
        return reportProductRepository.findByUserId(userId);
    }

    @Override
    public ReportProduct createReportProduct(ReportProduct reportProduct) {
        return reportProductRepository.save(reportProduct);
    }

    @Override
    public void deleteReportProduct(Long id) {
        if (!reportProductRepository.existsById(id)) {
            throw new RuntimeException("ReportProduct not found with id: " + id);
        }
        reportProductRepository.deleteById(id);
    }
}
