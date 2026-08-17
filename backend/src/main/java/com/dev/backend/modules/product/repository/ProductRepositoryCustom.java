package com.dev.backend.modules.product.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.dev.backend.modules.product.dto.request.UserFilterRequest;
import com.dev.backend.modules.product.dto.response.ProductCardResponse;

public interface ProductRepositoryCustom {
    Page<ProductCardResponse> searchProductsForUser(UserFilterRequest request,Long userId,  Pageable pageable);
}
