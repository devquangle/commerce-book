package com.dev.backend.modules.genre_product.repository;

import com.dev.backend.modules.genre_product.dto.GenreProductResponse;
import com.dev.backend.modules.genre_product.entity.GenreProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GenreProductRepository extends JpaRepository<GenreProduct, Long> {

    @Modifying
    @Query("DELETE FROM GenreProduct item WHERE item.product.id = :productId")
    void deleteByProductId(@Param("productId") Long productId);

    List<GenreProduct> findByProductIdIn(List<Long> productIds);

    List<GenreProduct> findByGenreId(Long genreId);

    @Query("""
                SELECT DISTINCT item.genre.name
                FROM GenreProduct item
                WHERE item.product.id = :productId
                ORDER BY item.genre.name
            """)
    List<String> findGenreNamesByProductId(@Param("productId") Long productId);

    @Query("""
                SELECT DISTINCT item.genre.id
                FROM GenreProduct item
                WHERE item.product.id = :productId
                ORDER BY item.genre.id
            """)
    List<Long> findGenreIdsByProductId(@Param("productId") Long productId);

    @Query("""
            SELECT new com.dev.backend.modules.genre_product.dto.GenreProductResponse(
                g.id,
                g.name,
                g.slug
            )
            FROM GenreProduct gp
            JOIN gp.genre g
            GROUP BY g.id, g.name, g.slug
            """)
    List<GenreProductResponse> findGenresWithProducts();
}
