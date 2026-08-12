package com.dev.backend.modules.address.service;

import com.dev.backend.modules.address.dto.AddressRequest;
import com.dev.backend.modules.address.dto.AddressResponse;
import com.dev.backend.modules.address.entity.Address;

import java.util.List;

public interface AddressService {
    void validate();


    Address getByIdAndUserId(Long id,Long userId);

    List<AddressResponse> getByUserId(Long userId);

    AddressResponse create(AddressRequest request, Long userId);

    AddressResponse update(Long id, AddressRequest request, Long userId);

    AddressResponse detail(Long id, Long userId);

    void delete(Long id, Long userId);

    void defaultAddress(Long id, Long userId);
}
