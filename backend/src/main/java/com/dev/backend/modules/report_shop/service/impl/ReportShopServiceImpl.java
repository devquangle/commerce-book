package com.dev.backend.modules.report_shop.service.impl;

import com.dev.backend.modules.report_shop.entity.ReportShop;
import com.dev.backend.modules.report_shop.repository.ReportShopRepository;
import com.dev.backend.modules.report_shop.service.ReportShopService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ReportShopServiceImpl implements ReportShopService {

    private final ReportShopRepository reportShopRepository;

    @Override
    @Transactional(readOnly = true)
    public List<ReportShop> getAllReportShops() {
        return reportShopRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public ReportShop getReportShopById(Long id) {
        return reportShopRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ReportShop not found with id: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReportShop> getReportShopsByShopId(Long shopId) {
        return reportShopRepository.findByShopId(shopId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReportShop> getReportShopsByUserId(Long userId) {
        return reportShopRepository.findByUserId(userId);
    }

    @Override
    public ReportShop createReportShop(ReportShop reportShop) {
        return reportShopRepository.save(reportShop);
    }

    @Override
    public void deleteReportShop(Long id) {
        if (!reportShopRepository.existsById(id)) {
            throw new RuntimeException("ReportShop not found with id: " + id);
        }
        reportShopRepository.deleteById(id);
    }
}
