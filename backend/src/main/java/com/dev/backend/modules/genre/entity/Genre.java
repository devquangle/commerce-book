package com.dev.backend.modules.genre.entity;

import com.dev.backend.common.entity.BaseEntity;
import com.dev.backend.common.enums.GenreStatus;
import com.dev.backend.modules.genre_product.entity.GenreProduct;
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
@Table(name = "genres")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Genre extends BaseEntity {

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "slug", length = 100)
    private String slug;

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private GenreStatus status;

    @OneToMany(mappedBy = "genre", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<GenreProduct> genreProducts = new ArrayList<>();
}
