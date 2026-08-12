package com.dev.backend.modules.others.ghn.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dev.backend.common.response.ResponseData;
import com.dev.backend.common.response.ResponseUtil;
import com.dev.backend.modules.others.ghn.dto.CalculateFeeRequest;
import com.dev.backend.modules.others.ghn.dto.DistrictResponse;
import com.dev.backend.modules.others.ghn.dto.DistrictRequest;
import com.dev.backend.modules.others.ghn.dto.ProvinceResponse;
import com.dev.backend.modules.others.ghn.dto.ProvinceRequest;
import com.dev.backend.modules.others.ghn.dto.WardResponse;
import com.dev.backend.modules.others.ghn.service.GHNService;

import lombok.RequiredArgsConstructor;
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/ghn")
public class GHNController {

     private final GHNService ghnService;

    @GetMapping("/provinces")
    public ResponseEntity<ResponseData<List<ProvinceResponse>>> getProvinces() {
        List<ProvinceResponse> provinceDTOs = ghnService.getProvinces();
        return ResponseUtil.success("Lấy danh sách tỉnh thành thành công", provinceDTOs);
    }

    @PostMapping("/districts")
    public ResponseEntity<ResponseData<List<DistrictResponse>>> getDistricts(@RequestBody ProvinceRequest request) {
        List<DistrictResponse> districtDTOs = ghnService.getDistricts(request.provinceId());

        return ResponseUtil.success("Lấy danh sách quận huyện thành công", districtDTOs);
    }

    @PostMapping("/wards")
    public ResponseEntity<ResponseData<List<WardResponse>>> getWards(@RequestBody DistrictRequest request) {
        List<WardResponse> wardDTOs = ghnService.getWards(request.districtId());
        return ResponseUtil.success("Lấy danh sách phường xã thành công", wardDTOs);
    }

    @PostMapping("/shipping-fee")
    public ResponseEntity<ResponseData<Integer>> getCalculateFee(
            @RequestBody CalculateFeeRequest calculateFeeRequest) {
        Integer fee = ghnService.calculateShippingFee(calculateFeeRequest);
        return ResponseUtil.success("Tính phí vận chuyển thành công", fee);
    }
}