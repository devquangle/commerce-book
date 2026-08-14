package com.dev.backend.modules.product.dto.response;

import com.dev.backend.common.enums.ProductStatus;

public interface SuperAdminProductProjection {

    Long getProductId();

    String getName();

    String getProductSlug();

    Integer getOriginalPrice();

    Integer getPrice();

    Integer getQuantity();

    String getReason();
    
    ProductStatus getStatus();

    Long getShopId();

    String getShopName();

    String getShopSlug();

}
