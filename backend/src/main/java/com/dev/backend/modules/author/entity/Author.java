package com.dev.backend.modules.author.entity;

import com.dev.backend.common.entity.BaseEntity;
import com.dev.backend.common.enums.AuthorStatus;
import com.dev.backend.modules.author_product.entity.AuthorProduct;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "authors")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Author extends BaseEntity {

    @Column(name = "name", nullable = false, length = 150)
    private String name;

    @Column(name = "slug", length = 150)
    private String slug;

    @Column(name = "wikibase_item", length = 100)
    private String wikibaseItem;

    @Column(name = "url_image", columnDefinition = "TEXT")
    private String urlImage;

    @Column(name = "url_bio", columnDefinition = "TEXT")
    private String urlBio;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private AuthorStatus status;

    @OneToMany(mappedBy = "author", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<AuthorProduct> authorProducts = new ArrayList<>();
}
