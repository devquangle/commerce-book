package com.dev.backend.modules.shop.dto;

import com.dev.backend.common.enums.ShopStatus;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class AdminShopFilterRequest {
    private String keyword;
    private ShopStatus status;
    private Integer page;
    private Integer size;
    private String sortBy;
    private String sortDirection;

    public int getPageNumber() {
        return (page != null && page > 0) ? page - 1 : 0;
    }

    public int getPageSize() {
        return (size != null && size > 0) ? size : 10;
    }
}
