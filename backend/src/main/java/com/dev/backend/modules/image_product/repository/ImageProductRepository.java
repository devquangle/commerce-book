package com.dev.backend.modules.image_product.repository;

import com.dev.backend.modules.image_product.entity.ImageProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ImageProductRepository extends JpaRepository<ImageProduct, Long> {
    List<ImageProduct> findByProductId(@Param("productId") Long productId);

    @Query("""
                SELECT item.urlImage
                FROM ImageProduct item
                WHERE item.product.id = :productId
                  AND item.isThumbnail = true
            """)
    Optional<String> findDefaultImageUrlByProductId(@Param("productId") Long productId);
}
