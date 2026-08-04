package com.dev.backend.modules.author_product.service;

import java.util.List;

public interface AuthorProductService {

    List<String> getAuthorNamesByProductId(Long productId);
}
