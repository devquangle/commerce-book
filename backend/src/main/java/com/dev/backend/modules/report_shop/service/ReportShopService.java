package com.dev.backend.modules.report_shop.service;

import com.dev.backend.modules.report_shop.entity.ReportShop;

import java.util.List;

public interface ReportShopService {
    List<ReportShop> getAllReportShops();
    ReportShop getReportShopById(Long id);
    List<ReportShop> getReportShopsByShopId(Long shopId);
    List<ReportShop> getReportShopsByUserId(Long userId);
    ReportShop createReportShop(ReportShop reportShop);
    void deleteReportShop(Long id);
}
