package com.dev.backend.modules.address.entity;

import com.dev.backend.common.entity.BaseEntity;
import com.dev.backend.modules.user.entity.User;
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
@Table(name = "addresses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Address extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;


    private String fullName;
    private String phone;

    @Column(name = "province_id")
    private Integer provinceId;

    @Column(name = "district_id")
    private Integer districtId;

    @Column(name = "ward_code", length = 50)
    private String wardCode;

    @Column(name = "street")
    private String street;

    @Column(name = "street_full")
    private String streetFull;

    @Column(name = "is_default")
    private boolean isDefault;

    @Column(name = "is_shop")
    private boolean isShop;
}
