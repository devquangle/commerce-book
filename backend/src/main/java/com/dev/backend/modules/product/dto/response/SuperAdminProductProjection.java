package com.dev.backend.modules.product.dto.response;

import com.dev.backend.common.enums.ProductStatus;

public interface SuperAdminProductProjection {
    Long productId();

    String name();

    String productSlug();

    Integer originalPrice();

    Integer price();

    Integer quantity();

    ProductStatus status();

    Long shopId();

    String shopName();

    String shopSlug();

}
