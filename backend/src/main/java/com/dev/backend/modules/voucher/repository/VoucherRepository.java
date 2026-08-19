package com.dev.backend.modules.voucher.repository;

import com.dev.backend.common.enums.ProductStatus;
import com.dev.backend.common.enums.VoucherStatus;
import com.dev.backend.modules.voucher.entity.Voucher;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface VoucherRepository extends JpaRepository<Voucher, Long> {
    Optional<Voucher> findByCode(String code);

    List<Voucher> findByShopId(Long shopId);

    @Query("""
            SELECT v
            FROM Voucher v
            WHERE v.shop.id = :shopId
              AND (:keyword IS NULL OR :keyword = ''
                   OR LOWER(v.code) LIKE LOWER(CONCAT('%', :keyword, '%'))
                   OR LOWER(v.name) LIKE LOWER(CONCAT('%', :keyword, '%')))
              AND (:startDate IS NULL OR v.startDate >= :startDate)
              AND (:endDate IS NULL OR v.endDate <= :endDate)
              AND (:status IS NULL OR v.status = :status)
            """)
    Page<Voucher> searchVouchersByShopId(
            @Param("keyword") String keyword,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            @Param("status") VoucherStatus status,
            @Param("shopId") Long shopId,
            Pageable pageable);
}
