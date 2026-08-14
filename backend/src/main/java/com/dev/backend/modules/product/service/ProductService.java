package com.dev.backend.modules.product.service;

import java.util.List;
import java.util.Map;

import com.dev.backend.common.response.PageResponse;
import com.dev.backend.modules.product.dto.ProductDetailResponse;
import com.dev.backend.modules.product.dto.ProductFilterRequest;
import com.dev.backend.modules.product.dto.ProductRequest;
import com.dev.backend.modules.product.dto.ProductResponse;
import com.dev.backend.modules.product.dto.ProductShopResponse;
import com.dev.backend.modules.product.dto.request.SuperAdminFilterRequest;
import com.dev.backend.modules.product.dto.response.SuperAdminProductResponse;
import com.dev.backend.modules.product.entity.Product;
import com.dev.backend.modules.shop.dto.ShopSimpleResponse;
import com.dev.backend.modules.shop.entity.Shop;

public interface ProductService {
    // List<ProductResponse> getAllProducts();

    // ProductResponse getProductById(Long id);

    // List<ProductResponse> getProductsByShopId(Long shopId);

    // ProductResponse createProduct(ProductRequest request);

    // ProductResponse updateProduct(Long id, ProductRequest request);

    // void deleteProduct(Long id);

    List<ProductShopResponse> findByIdIn(List<Long> productIds);

    Product getProductBySlugAndShopId(String slug, Long shopId);

    Product getProductByIdAndShopId(Long id, Long shopId);

    Product getById(Long id);

    ProductResponse mapToDTO(Product product);

    ProductResponse create(ProductRequest request, Shop shop);

    ProductResponse update(Long id, ProductRequest request, Long shopId);

    ProductDetailResponse detail(String slug, Long shopId);

    void delete(Long id, Long shopId);

    void validate(ProductRequest request);

    PageResponse<ProductResponse> searchProductsForShop(
            ProductFilterRequest request,Long shopId);

    PageResponse<SuperAdminProductResponse> searchProductsForAdmin(
            SuperAdminFilterRequest request);

    void approve(Long id);

    void reject(Long id, String reasons);

    Map<Long, ShopSimpleResponse> findShopMap(List<Long> productIds);
}
