package com.dev.backend.modules.author_product.service;

import java.util.List;
import java.util.Map;

import com.dev.backend.modules.author_product.dto.AuthorProductResponse;
import com.dev.backend.modules.product.entity.Product;

public interface AuthorProductService {

    List<String> getAuthorNamesByProductId(Long productId);

    Map<Long, List<String>> findAuthorMap(List<Long> productIds);

    List<Long> getAuthorIdsByProductId(Long productId);

    void setAuthorsProduct(Product product, List<Long> authorIds);

    List<AuthorProductResponse> getAuthorsWithProducts();

    List<AuthorProductResponse> getAuthorsByProductId(Long productId);
}
