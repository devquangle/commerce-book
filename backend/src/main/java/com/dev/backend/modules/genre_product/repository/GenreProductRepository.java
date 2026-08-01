package com.dev.backend.modules.genre_product.repository;

import com.dev.backend.modules.genre_product.entity.GenreProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GenreProductRepository extends JpaRepository<GenreProduct, Long> {
    List<GenreProduct> findByProductId(Long productId);
    List<GenreProduct> findByGenreId(Long genreId);
}
