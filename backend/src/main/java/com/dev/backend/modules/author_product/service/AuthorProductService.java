package com.dev.backend.modules.author_product.service;

import com.dev.backend.modules.author_product.entity.AuthorProduct;

import java.util.List;

public interface AuthorProductService {
    List<AuthorProduct> getAllAuthorProducts();
    AuthorProduct getAuthorProductById(Long id);
    List<AuthorProduct> getAuthorProductsByProductId(Long productId);
    List<AuthorProduct> getAuthorProductsByAuthorId(Long authorId);
    AuthorProduct createAuthorProduct(AuthorProduct authorProduct);
    void deleteAuthorProduct(Long id);
}
