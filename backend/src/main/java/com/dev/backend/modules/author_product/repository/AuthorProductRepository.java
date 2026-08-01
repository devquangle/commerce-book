package com.dev.backend.modules.author_product.repository;

import com.dev.backend.modules.author_product.entity.AuthorProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuthorProductRepository extends JpaRepository<AuthorProduct, Long> {
    List<AuthorProduct> findByProductId(Long productId);
    List<AuthorProduct> findByAuthorId(Long authorId);
}
