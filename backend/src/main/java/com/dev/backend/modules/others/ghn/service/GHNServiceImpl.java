package com.dev.backend.modules.others.ghn.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import com.dev.backend.common.response.GHNCalculateFeeResponse;
import com.dev.backend.common.response.GHNResponse;
import com.dev.backend.config.ghn.GHNConfig;
import com.dev.backend.modules.others.ghn.dto.CalculateFeeRequest;
import com.dev.backend.modules.others.ghn.dto.DistrictDTO;
import com.dev.backend.modules.others.ghn.dto.ProvinceDTO;
import com.dev.backend.modules.others.ghn.dto.TotalFeeResponse;
import com.dev.backend.modules.others.ghn.dto.WardDTO;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class GHNServiceImpl implements GHNService {
    private final RestTemplate restTemplate;
    private final GHNConfig ghnConfig;

    private HttpHeaders headers() {
        HttpHeaders headers = new HttpHeaders();

        headers.set("Token", ghnConfig.getToken());
        headers.set("ShopId", ghnConfig.getShopId());
        headers.setContentType(MediaType.APPLICATION_JSON);

        return headers;
    }

    @Override
    public List<ProvinceDTO> getProvinces() {
        HttpEntity<?> entity = new HttpEntity<>(headers());

        ResponseEntity<GHNResponse<ProvinceDTO>> response = restTemplate.exchange(
                ghnConfig.getMasterDataUrl() + "/province",
                HttpMethod.GET,
                entity,
                new ParameterizedTypeReference<GHNResponse<ProvinceDTO>>() {
                });

        if (response.getStatusCode() == HttpStatus.OK
                && response.getBody() != null
                && response.getBody().getCode() == 200) {

            Set<Integer> excludedIds = Set.of(2002, 298);
            List<ProvinceDTO> provinceDTOs = response.getBody().getData();

            List<ProvinceDTO> filtered = provinceDTOs.stream()
                    .filter(p -> !excludedIds.contains(p.getProvinceID()))
                    .collect(Collectors.toList());

            return filtered;
        }

        return List.of();
    }

    @Override
    public List<DistrictDTO> getDistricts(Integer provinceId) {
        Map<String, Object> body = new HashMap<>();
        body.put("province_id", provinceId);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers());

        ResponseEntity<GHNResponse<DistrictDTO>> response = restTemplate.exchange(
                ghnConfig.getMasterDataUrl() + "/district",
                HttpMethod.POST,
                entity,
                new ParameterizedTypeReference<GHNResponse<DistrictDTO>>() {
                });
        if (response.getStatusCode() == HttpStatus.OK
                && response.getBody() != null
                && response.getBody().getCode() == 200) {

            return response.getBody().getData();
        }

        return List.of();

    }

    @Override
    public List<WardDTO> getWards(Integer districtId) {

        Map<String, Object> body = new HashMap<>();
        body.put("district_id", districtId);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers());

        ResponseEntity<GHNResponse<WardDTO>> response = restTemplate.exchange(
                ghnConfig.getMasterDataUrl() + "/ward",
                HttpMethod.POST,
                entity,
                new ParameterizedTypeReference<GHNResponse<WardDTO>>() {
                });

        if (response.getStatusCode() == HttpStatus.OK
                && response.getBody() != null
                && response.getBody().getCode() == 200) {

            return response.getBody().getData();
        }

        return List.of();
    }

    @Override
    public String getStreetFull(Integer provinceId, Integer districtId, String wardCode, String street) {
        List<ProvinceDTO> provinceDTOs = getProvinces();
        ProvinceDTO provinceDTO = provinceDTOs.stream()
                .filter(p -> p.getProvinceID().equals(provinceId))
                .findFirst()
                .orElse(null);

        if (provinceDTO == null) {
            return null;

        }

        List<DistrictDTO> districtDTOs = getDistricts(provinceId);
        DistrictDTO districtDTO = districtDTOs.stream()
                .filter(d -> d.getDistrictID().equals(districtId))
                .findFirst()
                .orElse(null);

        if (districtDTO == null) {
            return null;
        }

        List<WardDTO> wardDTOs = getWards(districtId);
        WardDTO wardDTO = wardDTOs.stream()
                .filter(w -> w.getWardCode().equals(wardCode))
                .findFirst()
                .orElse(null);

        if (wardDTO == null) {
            return null;
        }
        String streetFull = street + ", " + provinceDTO.getProvinceName() + ", " + districtDTO.getDistrictName() + ", "
                + wardDTO.getWardName();

        return streetFull;
    }

    @Override
    public Integer calculateShippingFee(CalculateFeeRequest request) {
        try {
            Map<String, Object> body = new HashMap<>();
            body.put("service_type_id", 2);
            body.put("to_district_id", request.getToDistrictId());
            body.put("to_ward_code", request.getToWardCode());
            body.put("weight", Math.round(request.getWeight()));
            log.info("toDistrictId: {}", request.getToDistrictId());
            log.info("toWardCode: {}", request.getToWardCode());
            log.info("weight: {}", Math.round(request.getWeight()));

            log.info("shippingFeeUrl: {}", ghnConfig.getShippingFeeUrl());
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers());

            ResponseEntity<GHNCalculateFeeResponse<TotalFeeResponse>> response = restTemplate.exchange(
                    ghnConfig.getShippingFeeUrl(),
                    HttpMethod.POST,
                    entity,
                    new ParameterizedTypeReference<>() {
                    });

            if (response.getStatusCode() == HttpStatus.OK
                    && response.getBody() != null
                    && response.getBody().getCode() == 200) {

                return response.getBody().getData().getTotal();
            }

        } catch (HttpClientErrorException e) {
            log.error("Status: {}", e.getStatusCode());
            log.error("Response: {}", e.getResponseBodyAsString());
            throw e;
        }
        return 30000;
    }
}
