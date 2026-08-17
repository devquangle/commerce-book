package com.dev.backend.modules.product.entity;

import com.dev.backend.common.entity.BaseEntity;
import com.dev.backend.common.enums.ProductStatus;
import com.dev.backend.modules.author_product.entity.AuthorProduct;
import com.dev.backend.modules.genre_product.entity.GenreProduct;
import com.dev.backend.modules.image_product.entity.ImageProduct;
import com.dev.backend.modules.publisher.entity.Publisher;
import com.dev.backend.modules.review.entity.Review;
import com.dev.backend.modules.series.entity.Series;
import com.dev.backend.modules.shop.entity.Shop;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Product extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shop_id", nullable = false)
    private Shop shop;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "publisher_id")
    private Publisher publisher;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "series_id")
    private Series series;

    @Column(name = "name", nullable = false, length = 255)
    private String name;

    @Column(name = "slug", length = 255)
    private String slug;

    @Column(name = "language", length = 50)
    private String language;

    @Column(name = "isbn", length = 50)
    private String isbn;

    private LocalDate publishYear;

    private Integer weight;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "price")
    private Integer price;

    @Column(name = "original_price")
    private Integer originalPrice;

    @Column(name = "quantity")
    private Integer quantity;

    @Column(name = "pages")
    private Integer pages;

    
    @Column(name = "reason")
    private String reason;

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private ProductStatus status;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ImageProduct> images = new ArrayList<>();

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<AuthorProduct> authorProducts = new ArrayList<>();

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)

    private List<GenreProduct> genreProducts = new ArrayList<>();

    @OneToMany(mappedBy = "product")

    private List<Review> reviews = new ArrayList<>();

    private LocalDateTime approvedAt;

    
}
