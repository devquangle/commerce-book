package com.dev.backend.modules.product.repository;

import com.dev.backend.common.enums.ProductStatus;
import com.dev.backend.modules.product.dto.response.SuperAdminProductProjection;
import com.dev.backend.modules.product.entity.Product;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
        @EntityGraph(attributePaths = {
                        "shop"
        })
        List<Product> findByIdIn(List<Long> productIds);

        @EntityGraph(attributePaths = {
                        "publisher",
                        "series",
                        "shop"
        })
        @Query("""
                            SELECT item
                            FROM Product item
                            WHERE (:shopId IS NULL OR item.shop.id = :shopId)
                              AND (:status IS NULL OR item.status = :status)
                              AND (:keyword IS NULL
                                   OR LOWER(item.name) LIKE LOWER(CONCAT('%', :keyword, '%')))
                        """)
        Page<Product> searchProductsByShopId(
                        @Param("keyword") String keyword,
                        @Param("status") ProductStatus status,
                        @Param("shopId") Long shopId,
                        Pageable pageable);

        @Query("SELECT COUNT(item)>0 FROM Product item WHERE item.shop.id =:shopId AND item.slug = :slug ")
        boolean existsByShopIdAndSlug(@Param("shopId") Long shopId, @Param("slug") String slug);

         @EntityGraph(attributePaths = {
                        "publisher",
                        "series",
                        "shop"
        })
        @Query("""
                            SELECT p
                            FROM Product p
                            WHERE p.slug = :slug
                              AND p.shop.id = :shopId
                        """)
        Optional<Product> findProductBySlugAndShopId(
                        @Param("slug") String slug,
                        @Param("shopId") Long shopId);

        @EntityGraph(attributePaths = {
                        "publisher",
                        "series",
                        "shop"
        })
        @Query("""
                            SELECT p
                            FROM Product p
                            WHERE p.slug = :slug
                        """)
        Optional<Product> findBySlug(
                        @Param("slug") String slug);

        @EntityGraph(attributePaths = {
                        "publisher",
                        "series",
        })
        @Query("""
                            SELECT p
                            FROM Product p
                            WHERE p.id = :id
                              AND p.shop.id = :shopId
                        """)
        Optional<Product> findProductByIdAndShopId(
                        @Param("id") Long id,
                        @Param("shopId") Long shopId);

        @Query("""
                            SELECT
                                  item.id AS productId,
                                  item.name AS name,
                                  item.slug AS productSlug,
                                  item.originalPrice AS originalPrice,
                                  item.price AS price,
                                  item.quantity AS quantity,
                                  item.reason AS reason,
                                  item.status AS status,
                                  s.id AS shopId,
                                  s.name AS shopName,
                                  s.slug AS shopSlug
                            FROM Product item
                            LEFT JOIN item.shop s
                            WHERE (:shopId IS NULL OR s.id = :shopId)
                              AND (:status IS NULL OR item.status = :status)
                              AND (:keyword IS NULL
                                   OR LOWER(item.name) LIKE LOWER(CONCAT('%', :keyword, '%')))
                        """)
        Page<SuperAdminProductProjection> searchProductsForAdmin(
                        @Param("keyword") String keyword,
                        @Param("status") ProductStatus status,
                        @Param("shopId") Long shopId,
                        Pageable pageable);
}
