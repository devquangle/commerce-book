package com.dev.backend.modules.promotion.repository;

import com.dev.backend.common.enums.PromotionStatus;
import com.dev.backend.modules.promotion.entity.Promotion;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PromotionRepository extends JpaRepository<Promotion, Long> {
    List<Promotion> findByShopId(Long shopId);

    @Query("""
            SELECT p
            FROM Promotion p
            WHERE p.shop.id = :shopId
              AND (
                  :keyword IS NULL
                  OR :keyword = ''
                  OR LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
              )
              AND (
                  :startDate IS NULL
                  OR p.endDate >= :startDate
              )
              AND (
                  :endDate IS NULL
                  OR p.startDate <= :endDate
              )
              AND (
                  :status IS NULL
                  OR p.status = :status
              )
            """)
    Page<Promotion> searchPromotionsByShopId(
            @Param("keyword") String keyword,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            @Param("status") PromotionStatus status,
            @Param("shopId") Long shopId,
            Pageable pageable);
}
