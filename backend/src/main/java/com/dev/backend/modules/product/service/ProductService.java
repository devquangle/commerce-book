package com.dev.backend.modules.product.service;

import com.dev.backend.common.response.PageResponse;
import com.dev.backend.modules.product.dto.ProductFilterRequest;
import com.dev.backend.modules.product.dto.ProductRequest;
import com.dev.backend.modules.product.dto.ProductResponse;
import com.dev.backend.modules.product.entity.Product;
import com.dev.backend.modules.shop.entity.Shop;

public interface ProductService {
    // List<ProductResponse> getAllProducts();

    // ProductResponse getProductById(Long id);

    // List<ProductResponse> getProductsByShopId(Long shopId);

    // ProductResponse createProduct(ProductRequest request);

    // ProductResponse updateProduct(Long id, ProductRequest request);

    // void deleteProduct(Long id);

    ProductResponse mapToDTO(Product product);

    ProductResponse add(ProductRequest request, Shop shop);

    PageResponse<ProductResponse> searchProductsByShopId(ProductFilterRequest request, Long shopId);
}
