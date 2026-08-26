package com.dev.backend.modules.product.dto.response;

import java.time.LocalDateTime;

import com.dev.backend.common.enums.ProductStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ProductCardResponse {
    private Long productId;
    private String productName;
    private String productSlug;
    private Integer price; // giá sản phẩm product.price
    private Integer discountPercent;// phần %
    private Integer salePrice; // giá bán price × (100 - discountPercent) / 100
    private Double averageRating;// đánh giá trung bình 1-5
    private Integer soldCount;

    private String urlImageDefault;

    private Long shopId;
    private String shopSlug;
    private String shopName;

   

    private LocalDateTime approvedAt;

    private ProductStatus status;

    public ProductCardResponse(Long productId, String productName, String productSlug, Integer price,
            Integer discountPercent, Integer salePrice, String urlImageDefault,
            Long shopId, String shopSlug, String shopName,
            LocalDateTime approvedAt, ProductStatus status) {
        this.productId = productId;
        this.productName = productName;
        this.productSlug = productSlug;
        this.price = price;
        this.discountPercent = discountPercent != null ? discountPercent : 0;
        this.salePrice = salePrice != null ? salePrice : price;
        this.urlImageDefault = urlImageDefault != null ? urlImageDefault : "https://res.cloudinary.com/dox0mkwaz/image/upload/v1785952807/ofgunxcey5hbk9kauv7m.webp";
        this.shopId = shopId;
        this.shopSlug = shopSlug;
        this.shopName = shopName;
        this.averageRating = 0.0;
        this.soldCount = 0;
        this.approvedAt = approvedAt;
        this.status = status;
    }
}
