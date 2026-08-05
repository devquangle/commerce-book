package com.dev.backend.modules.image_product.entity;

import com.dev.backend.common.entity.BaseEntity;
import com.dev.backend.modules.product.entity.Product;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "image_products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ImageProduct extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(name = "url_image", nullable = false)
    private String urlImage;

    private String publicId;

    private boolean isThumbnail;
}
