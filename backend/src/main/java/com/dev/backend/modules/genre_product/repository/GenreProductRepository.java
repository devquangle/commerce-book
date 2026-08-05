package com.dev.backend.modules.genre_product.repository;

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

    List<GenreProduct> findByProductId(Long productId);

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
}
