package com.dev.backend.modules.report_product.repository;

import com.dev.backend.modules.report_product.entity.ReportProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReportProductRepository extends JpaRepository<ReportProduct, Long> {
    List<ReportProduct> findByProductId(Long productId);
    List<ReportProduct> findByUserId(Long userId);
}
