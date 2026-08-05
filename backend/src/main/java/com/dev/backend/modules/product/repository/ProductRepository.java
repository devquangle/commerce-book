package com.dev.backend.modules.product.repository;

import com.dev.backend.common.enums.ProductStatus;
import com.dev.backend.modules.product.entity.Product;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByShopId(Long shopId);

    @Query("""
                SELECT item
                FROM Product item
                WHERE (
                    :keyword IS NULL
                    OR LOWER(item.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
                )
                AND (
                    :status IS NULL
                    OR item.status = :status
                )
                AND item.shop.id=:shopId
            """)
    Page<Product> searchProductsByShopId(
            @Param("keyword") String keyword,
            @Param("status") ProductStatus status,
            @Param("shopId") Long shopId,
            Pageable pageable);

    @Query("SELECT COUNT(item)>0 FROM Product item WHERE item.shop.id =:shopId AND item.slug = :slug ")
    boolean existsByShopIdAndSlug(@Param("shopId") Long shopId, @Param("slug") String slug);
}
