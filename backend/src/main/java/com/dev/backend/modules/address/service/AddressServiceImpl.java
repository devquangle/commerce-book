package com.dev.backend.modules.address.service;

import com.dev.backend.common.exception.BadRequestException;
import com.dev.backend.common.exception.NotFoundException;
import com.dev.backend.modules.address.dto.AddressRequest;
import com.dev.backend.modules.address.dto.AddressResponse;
import com.dev.backend.modules.address.entity.Address;
import com.dev.backend.modules.address.mapper.AddressMapper;
import com.dev.backend.modules.address.repository.AddressRepository;
import com.dev.backend.modules.user.entity.User;
import com.dev.backend.modules.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class AddressServiceImpl implements AddressService {

    private final AddressRepository addressRepository;
    private final AddressMapper addressMapper;

    private final UserRepository userRepository;

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

        // Nếu là địa chỉ đầu tiên -> mặc định
        if (count == 0) {
            address.setDefault(true);
        } else {
            address.setDefault(request.defaultAddress());
        }
        address.setShop(false);

        Address saved = addressRepository.save(address);

        return addressMapper.toDTO(saved);
    }

    @Override
    public void defaultAddress(Long id, Long userId) {
        // TODO Auto-generated method stub

    }

    @Override
    public void delete(Long id, Long userId) {
        // TODO Auto-generated method stub

    }

    @Override
    public AddressResponse detail(AddressRequest request, Long userId) {
        // TODO Auto-generated method stub
        return null;
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
    public AddressResponse update(AddressRequest request, Long userId) {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public void validate() {
        // TODO Auto-generated method stub

    }

}
