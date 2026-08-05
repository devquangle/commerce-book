package com.dev.backend.modules.product.service;

import com.dev.backend.common.response.PageResponse;
import com.dev.backend.modules.product.dto.ProductDetailResponse;
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

    Product getProductBySlugAndShopId(String slug, Long shopId);

    Product getProductByIdAndShopId(Long id, Long shopId);

    ProductResponse mapToDTO(Product product);

    ProductResponse create(ProductRequest request, Shop shop);

    ProductResponse update(Long id, ProductRequest request, Long shopId);

    ProductDetailResponse detail(String slug, Long shopId);

    void delete(Long id, Long shopId);

    PageResponse<ProductResponse> searchProductsByShopId(ProductFilterRequest request, Long shopId);
}
