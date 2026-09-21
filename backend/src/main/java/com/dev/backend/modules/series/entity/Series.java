package com.dev.backend.modules.series.entity;

import com.dev.backend.common.entity.BaseEntity;
import com.dev.backend.common.enums.SeriesStatus;
import com.dev.backend.modules.product.entity.Product;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "series")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Series extends BaseEntity {

    @Column(name = "name", nullable = false, length = 150)
    private String name;

    @Column(name = "slug", nullable = false, length = 150)
    private String slug;

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private SeriesStatus status;

    @OneToMany(mappedBy = "series")
    private List<Product> products = new ArrayList<>();
}
