package com.dev.backend.modules.report_product.service;

import com.dev.backend.modules.report_product.entity.ReportProduct;

import java.util.List;

public interface ReportProductService {
    List<ReportProduct> getAllReportProducts();
    ReportProduct getReportProductById(Long id);
    List<ReportProduct> getReportProductsByProductId(Long productId);
    List<ReportProduct> getReportProductsByUserId(Long userId);
    ReportProduct createReportProduct(ReportProduct reportProduct);
    void deleteReportProduct(Long id);
}
