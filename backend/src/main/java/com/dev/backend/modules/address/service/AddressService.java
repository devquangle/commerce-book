package com.dev.backend.modules.address.service;

import com.dev.backend.modules.address.dto.AddressRequest;
import com.dev.backend.modules.address.dto.AddressResponse;

import java.util.List;

public interface AddressService {
    List<AddressResponse> getAllAddresses();
    AddressResponse getAddressById(Long id);
    List<AddressResponse> getAddressesByUserId(Long userId);
    AddressResponse createAddress(AddressRequest request);
    AddressResponse updateAddress(Long id, AddressRequest request);
    void deleteAddress(Long id);
}
