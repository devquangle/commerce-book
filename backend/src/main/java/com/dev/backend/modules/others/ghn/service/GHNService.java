package com.dev.backend.modules.others.ghn.service;

import java.util.List;

import com.dev.backend.modules.others.ghn.dto.CalculateFeeRequest;
import com.dev.backend.modules.others.ghn.dto.DistrictResponse;
import com.dev.backend.modules.others.ghn.dto.ProvinceResponse;
import com.dev.backend.modules.others.ghn.dto.WardResponse;


public interface GHNService {

        List<ProvinceResponse> getProvinces();

        List<DistrictResponse> getDistricts(Integer provinceId);

        List<WardResponse> getWards(Integer districtId);

        String getStreetFull(
                        Integer provinceId,
                        Integer districtId,
                        String wardCode,
                        String street);

        Integer calculateShippingFee(CalculateFeeRequest request);
}
