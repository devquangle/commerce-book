package com.dev.backend.modules.publisher.entity;

import com.dev.backend.common.entity.BaseEntity;
import com.dev.backend.common.enums.PublisherStatus;
import com.dev.backend.modules.product.entity.Product;
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
@Table(name = "publishers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Publisher extends BaseEntity {

    @Column(name = "name", nullable = false, length = 150)
    private String name;

    @Column(name = "slug", nullable = false, length = 150)
    private String slug;

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private PublisherStatus status;
    
    @OneToMany(mappedBy = "publisher")
    @Builder.Default
    private List<Product> products = new ArrayList<>();
}
