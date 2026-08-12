package com.dev.backend.modules.others.ghn.service;

import java.util.List;

import com.dev.backend.modules.others.ghn.dto.CalculateFeeRequest;
import com.dev.backend.modules.others.ghn.dto.DistrictDTO;
import com.dev.backend.modules.others.ghn.dto.ProvinceDTO;
import com.dev.backend.modules.others.ghn.dto.WardDTO;


public interface GHNService {

        List<ProvinceDTO> getProvinces();

        List<DistrictDTO> getDistricts(Integer provinceId);

        List<WardDTO> getWards(Integer districtId);

        String getStreetFull(
                        Integer provinceId,
                        Integer districtId,
                        String wardCode,
                        String street);

        Integer calculateShippingFee(CalculateFeeRequest request);
}
