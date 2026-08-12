package com.dev.backend.modules.others.ghn.mapper;

import org.springframework.stereotype.Component;

import com.dev.backend.modules.others.ghn.dto.ProvinceResponse;
@Component
public class GHNMapper {
   public ProvinceResponse toProvinceResponse(ProvinceResponse response) {
        if (response == null) {
            return null;
        }

        return new ProvinceResponse(
                response.provinceId(),
                response.provinceName()
        );
    }
}
