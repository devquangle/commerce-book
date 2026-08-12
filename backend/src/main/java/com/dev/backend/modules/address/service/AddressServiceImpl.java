package com.dev.backend.modules.address.service;

import com.dev.backend.common.exception.BadRequestException;
import com.dev.backend.common.exception.NotFoundException;
import com.dev.backend.modules.address.dto.AddressRequest;
import com.dev.backend.modules.address.dto.AddressResponse;
import com.dev.backend.modules.address.entity.Address;
import com.dev.backend.modules.address.mapper.AddressMapper;
import com.dev.backend.modules.address.repository.AddressRepository;
import com.dev.backend.modules.others.ghn.service.GHNService;
import com.dev.backend.modules.user.entity.User;
import com.dev.backend.modules.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class AddressServiceImpl implements AddressService {

    private final AddressRepository addressRepository;
    private final AddressMapper addressMapper;
    private final GHNService ghnService;
    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public Address getByIdAndUserId(Long id, Long userId) {
        return addressRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy địa chỉ"));

    }

    @Override
    public AddressResponse create(AddressRequest request, Long userId) {

        long count = addressRepository.countByUserId(userId);

        // Tối đa 6 địa chỉ
        if (count >= 6) {
            throw new BadRequestException(
                    "Bạn chỉ được lưu tối đa 6 địa chỉ");
        }

        Address address = new Address();

        addressMapper.toEntity(address, request);

        // Gán user
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy người dùng"));

        address.setUser(user);

        address.setStreetFull(ghnService.getStreetFull(address.getProvinceId(), address.getDistrictId(),
                address.getWardCode(), address.getStreet()));
        // Nếu là địa chỉ đầu tiên -> mặc định
        if (count == 0) {
            address.setDefault(true);
        }
        if (request.defaultAddress()) {
            addressRepository.resetDefaultAddress(userId);
            address.setDefault(true);
        } else {
            address.setDefault(false);
        }
        Address saved = addressRepository.save(address);

        return addressMapper.toDTO(saved);
    }

    @Override
    @Transactional
    public void defaultAddress(Long id, Long userId) {
        addressRepository.resetDefaultAddress(userId);
        Address address = getByIdAndUserId(id, userId);
        address.setDefault(true);
        addressRepository.save(address);
    }

    @Override
    @Transactional
    public void delete(Long id, Long userId) {
        Address address = getByIdAndUserId(id, userId);
        addressRepository.delete(address);

    }

    @Override
    @Transactional(readOnly = true)
    public AddressResponse detail(Long id, Long userId) {
        Address address = getByIdAndUserId(id, userId);
        return addressMapper.toDTO(address);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AddressResponse> getByUserId(Long userId) {
        return addressRepository.findByUserId(userId)
                .stream()
                .map(addressMapper::toDTO)
                .toList();
    }

    @Override
    @Transactional
    public AddressResponse update(Long id, AddressRequest request, Long userId) {
        Address address = getByIdAndUserId(id, userId);
        addressMapper.toEntity(address, request);
      if (request.defaultAddress()) {
            addressRepository.resetDefaultAddress(userId);
            address.setDefault(true);
        } else {
            address.setDefault(false);
        }
        address.setStreetFull(ghnService.getStreetFull(address.getProvinceId(), address.getDistrictId(),
                address.getWardCode(), address.getStreet()));
        Address saved = addressRepository.save(address);
        return addressMapper.toDTO(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public void validate() {
        // TODO Auto-generated method stub

    }

}
