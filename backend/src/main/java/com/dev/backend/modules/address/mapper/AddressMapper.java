package com.dev.backend.modules.address.mapper;

import com.dev.backend.modules.address.dto.AddressRequest;
import com.dev.backend.modules.address.dto.AddressResponse;
import com.dev.backend.modules.address.entity.Address;
import org.springframework.stereotype.Component;

@Component
public class AddressMapper {

    public Address toEntity(AddressRequest request) {
        if (request == null) {
            return null;
        }
        return Address.builder()
                .provinceId(request.getProvinceId())
                .districtId(request.getDistrictId())
                .wardCode(request.getWardCode())
                .street(request.getStreet())
                .streetFull(request.getStreetFull())
                .isDefault(Boolean.TRUE.equals(request.getIsDefault()))
                .isShop(Boolean.TRUE.equals(request.getIsShop()))
                .build();
    }

    public AddressResponse toResponse(Address entity) {
        if (entity == null) {
            return null;
        }
        return AddressResponse.builder()
                .id(entity.getId())
                .userId(entity.getUser() != null ? entity.getUser().getId() : null)
                .provinceId(entity.getProvinceId())
                .districtId(entity.getDistrictId())
                .wardCode(entity.getWardCode())
                .street(entity.getStreet())
                .streetFull(entity.getStreetFull())
                .isDefault(entity.isDefault())
                .isShop(entity.isShop())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    public void updateEntityFromRequest(AddressRequest request, Address entity) {
        if (request == null || entity == null) {
            return;
        }
        if (request.getProvinceId() != null) {
            entity.setProvinceId(request.getProvinceId());
        }
        if (request.getDistrictId() != null) {
            entity.setDistrictId(request.getDistrictId());
        }
        if (request.getWardCode() != null) {
            entity.setWardCode(request.getWardCode());
        }
        if (request.getStreet() != null) {
            entity.setStreet(request.getStreet());
        }
        if (request.getStreetFull() != null) {
            entity.setStreetFull(request.getStreetFull());
        }
        if (request.getIsDefault() != null) {
            entity.setDefault(request.getIsDefault());
        }
        if (request.getIsShop() != null) {
            entity.setShop(request.getIsShop());
        }
    }
}
