package com.dev.backend.modules.address.mapper;

import com.dev.backend.modules.address.dto.AddressRequest;
import com.dev.backend.modules.address.dto.AddressResponse;
import com.dev.backend.modules.address.entity.Address;
import org.springframework.stereotype.Component;

@Component
public class AddressMapper {

    public Address toEntity(Address address, AddressRequest request) {
        if (request == null) {
            return null;
        }
        address.setFullName(request.fullName());
        address.setPhone(request.phone());
        address.setProvinceId(request.provinceId());
        address.setDistrictId(request.districtId());
        address.setWardCode(request.wardCode());
        address.setStreet(request.street());
        address.setShop(false);
        return address;
    }

    public AddressResponse toDTO(Address address) {
        if (address == null) {
            return null;
        }

        return new AddressResponse(
                address.getId(),
                address.getFullName(),
                address.getPhone(),
                address.getProvinceId(),
                address.getDistrictId(),
                address.getWardCode(),
                address.getStreet(),
                address.getStreetFull(),
                address.isDefault(),
                address.isShop());
    }
}
