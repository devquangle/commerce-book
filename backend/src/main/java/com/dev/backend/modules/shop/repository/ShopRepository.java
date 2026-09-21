package com.dev.backend.modules.shop.repository;

import com.dev.backend.modules.shop.entity.Shop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

import com.dev.backend.common.enums.ShopStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

@Repository
public interface ShopRepository extends JpaRepository<Shop, Long> {
    Optional<Shop> findByOwnerId(Long ownerId);
    boolean existsByName(String name);
    boolean existsBySlug(String slug);

    long countByStatus(ShopStatus status);

    @Query(value = """
        SELECT s FROM Shop s
        JOIN FETCH s.owner o
        WHERE (:keyword IS NULL OR :keyword = ''
            OR LOWER(s.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
            OR LOWER(o.fullName) LIKE LOWER(CONCAT('%', :keyword, '%'))
            OR LOWER(o.email) LIKE LOWER(CONCAT('%', :keyword, '%'))
            OR LOWER(o.phone) LIKE LOWER(CONCAT('%', :keyword, '%'))
        )
        AND (:status IS NULL OR s.status = :status)
    """,
    countQuery = """
        SELECT COUNT(s) FROM Shop s
        JOIN s.owner o
        WHERE (:keyword IS NULL OR :keyword = ''
            OR LOWER(s.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
            OR LOWER(o.fullName) LIKE LOWER(CONCAT('%', :keyword, '%'))
            OR LOWER(o.email) LIKE LOWER(CONCAT('%', :keyword, '%'))
            OR LOWER(o.phone) LIKE LOWER(CONCAT('%', :keyword, '%'))
        )
        AND (:status IS NULL OR s.status = :status)
    """)
    Page<Shop> searchForAdmin(
            @Param("keyword") String keyword,
            @Param("status") ShopStatus status,
            Pageable pageable);

    @Query("""
        SELECT s FROM Shop s
        JOIN FETCH s.owner o
        WHERE s.id = :id
    """)
    Optional<Shop> findByIdWithOwner(@Param("id") Long id);
}
