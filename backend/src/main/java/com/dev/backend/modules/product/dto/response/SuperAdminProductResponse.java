package com.dev.backend.modules.product.dto.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SuperAdminProductResponse extends ProductInfoResponse {

    private Long shopId;
    private String shopName;
    private String shopSlug;
}