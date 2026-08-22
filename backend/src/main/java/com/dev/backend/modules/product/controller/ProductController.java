package com.dev.backend.modules.product.controller;

import java.util.List;

import org.springframework.data.repository.query.Param;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.dev.backend.common.response.PageResponse;
import com.dev.backend.common.response.ResponseData;
import com.dev.backend.common.response.ResponseUtil;
import com.dev.backend.modules.product.dto.ProductResponse;
import com.dev.backend.modules.product.dto.ProductShopResponse;
import com.dev.backend.modules.product.dto.request.ProductRequest;
import com.dev.backend.modules.product.dto.request.RejectProductRequest;
import com.dev.backend.modules.product.dto.request.ShopProductFilterRequest;
import com.dev.backend.modules.product.dto.request.SuperAdminFilterRequest;
import com.dev.backend.modules.product.dto.request.UserFilterRequest;
import com.dev.backend.modules.product.dto.response.ProductCardResponse;
import com.dev.backend.modules.product.dto.response.ProductDetailResponse;
import com.dev.backend.modules.product.dto.response.ProductFullResponse;
import com.dev.backend.modules.product.dto.response.SuperAdminProductResponse;
import com.dev.backend.modules.product.service.ProductService;
import com.dev.backend.security.custom.CustomUserDetails;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1")
public class ProductController {
    private final ProductService productService;

    @GetMapping("/shop/products/filter")
    public ResponseEntity<ResponseData<PageResponse<ProductResponse>>> searchProductsForShop(
            @ModelAttribute ShopProductFilterRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        PageResponse<ProductResponse> response = productService.searchProductsForShop(request,
                userDetails.getShop().getId());
        return ResponseUtil.success("Lấy danh sách sản phẩm thành công", response);
    }

    @PostMapping("/shop/products")
    public ResponseEntity<ResponseData<ProductResponse>> create(@RequestBody @Valid ProductRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        ProductResponse response = productService.create(request, userDetails.getShop());
        return ResponseUtil.success("Thêm sản phẩm thành công", response);
    }

    @GetMapping("/shop/products")
    public ResponseEntity<ResponseData<ProductDetailResponse>> detail(@Param("slug") String slug,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        ProductDetailResponse response = productService.detail(slug, userDetails.getShop().getId());
        return ResponseUtil.success("Lấy thông tin sản phẩm thành công", response);
    }

    @PutMapping("/shop/products/{id}")
    public ResponseEntity<ResponseData<ProductResponse>> update(@PathVariable("id") Long id,
            @RequestBody @Valid ProductRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        ProductResponse response = productService.update(id, request, userDetails.getShop().getId());
        return ResponseUtil.success("Cập nhật sản phẩm thành công", response);
    }

    @DeleteMapping("/shop/products/{id}")
    public ResponseEntity<ResponseData<Void>> dete(@PathVariable("id") Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        productService.delete(id, userDetails.getShop().getId());
        return ResponseUtil.successMessage("Xoá sản phẩm thành công");
    }

    @PostMapping("/products/shops")
    public ResponseEntity<ResponseData<List<ProductShopResponse>>> getShopsByProductIds(
            @RequestBody List<Long> productIds) {

        return ResponseUtil.success(
                "Lấy danh sách shop thành công",
                productService.findByIdIn(productIds));
    }

    @GetMapping("/admin/products/filter")
    public ResponseEntity<ResponseData<PageResponse<SuperAdminProductResponse>>> searchProductsForAdmin(
            @ModelAttribute SuperAdminFilterRequest request) {
        PageResponse<SuperAdminProductResponse> response = productService.searchProductsForAdmin(request);
        return ResponseUtil.success("Lấy danh sách sản phẩm thành công", response);
    }

    @GetMapping("/admin/products")
    public ResponseEntity<ResponseData<ProductDetailResponse>> detail(@Param("slug") String slug) {
        ProductDetailResponse response = productService.detail(slug);
        return ResponseUtil.success("Lấy thông tin sản phẩm thành công", response);
    }

    @PutMapping("/admin/products/approve/{id}")
    public ResponseEntity<ResponseData<Void>> approve(@PathVariable("id") Long id) {
        productService.approve(id);
        return ResponseUtil.successMessage("Duyệt sản phẩm thành công.");
    }

    @PutMapping("/admin/products/reject/{id}")
    public ResponseEntity<ResponseData<Void>> reject(@PathVariable("id") Long id,
            @Valid @RequestBody RejectProductRequest request) {
        productService.reject(id, request.getReason());
        return ResponseUtil.successMessage("Từ chối sản phẩm thành công.");
    }

    @GetMapping("/products/filter")
    public ResponseEntity<ResponseData<PageResponse<ProductCardResponse>>> searchProductsForUser(
            @ModelAttribute UserFilterRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        Long userId = userDetails != null ? userDetails.getUserId() : null;
        PageResponse<ProductCardResponse> response = productService.filterProductsForUser(request, userId);
        return ResponseUtil.success("Lấy danh sách sản phẩm thành công", response);
    }

    @GetMapping("/product-detail")
    public ResponseEntity<ResponseData<ProductFullResponse>> getProductDetail(
            @RequestParam("slug") String slug) {
        ProductFullResponse response = productService.detailFull(slug);
        return ResponseUtil.success("Lấy sản phẩm thành công", response);
    }
}
