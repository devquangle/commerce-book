package com.dev.backend.modules.author_product.service;

import java.util.List;

import com.dev.backend.modules.product.entity.Product;

public interface AuthorProductService {

    List<String> getAuthorNamesByProductId(Long productId);

    List<Long> getAuthorIdsByProductId(Long productId);

    void setAuthorsProduct(Product product, List<Long> authorIds);

}
