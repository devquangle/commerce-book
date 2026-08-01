package com.dev.backend.modules.report_shop.repository;

import com.dev.backend.modules.report_shop.entity.ReportShop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReportShopRepository extends JpaRepository<ReportShop, Long> {
    List<ReportShop> findByShopId(Long shopId);
    List<ReportShop> findByUserId(Long userId);
}
