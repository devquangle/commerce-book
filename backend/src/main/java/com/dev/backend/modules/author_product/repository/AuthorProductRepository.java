package com.dev.backend.modules.author_product.repository;

import com.dev.backend.modules.author_product.dto.AuthorProductResponse;
import com.dev.backend.modules.author_product.entity.AuthorProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuthorProductRepository extends JpaRepository<AuthorProduct, Long> {

    List<AuthorProduct> findByProductIdIn(List<Long> productIds);

    @Modifying
    @Query("DELETE FROM AuthorProduct item WHERE item.product.id = :productId")
    void deleteByProductId(@Param("productId") Long productId);

    @Query("""
                SELECT DISTINCT item.author.name
                FROM AuthorProduct item
                WHERE item.product.id = :productId
                ORDER BY item.author.name
            """)
    List<String> findAuthorNamesByProductId(@Param("productId") Long productId);

    @Query("""
                SELECT DISTINCT item.author.id
                FROM AuthorProduct item
                WHERE item.product.id = :productId
                ORDER BY item.author.id
            """)
    List<Long> findAuthorIdsByProductId(@Param("productId") Long productId);

    @Query("""
            SELECT new com.dev.backend.modules.author_product.dto.AuthorProductResponse(
                a.id,
                a.name,
                a.slug
            )
            FROM AuthorProduct ap
            JOIN ap.author a
            GROUP BY a.id, a.name, a.slug
            """)
    List<AuthorProductResponse> findAuthorsWithProducts();
}
