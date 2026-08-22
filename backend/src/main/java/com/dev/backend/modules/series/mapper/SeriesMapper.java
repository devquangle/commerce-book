package com.dev.backend.modules.series.mapper;

import com.dev.backend.common.utils.TextUtils;
import com.dev.backend.modules.series.dto.SeriesProductResponse;
import com.dev.backend.modules.series.dto.SeriesRequest;
import com.dev.backend.modules.series.dto.SeriesResponse;
import com.dev.backend.modules.series.entity.Series;
import org.springframework.stereotype.Component;

@Component
public class SeriesMapper {

    public Series toEntity(Series series, SeriesRequest request) {
        if (series == null || request == null) {
            return null;
        }
        series.setName(TextUtils.capitalizeFully(request.getName()));
        series.setSlug(TextUtils.toSlug(request.getName()));
        series.setStatus(request.getStatus());
        return series;

    }

    public SeriesResponse toDTO(Series entity) {
        if (entity == null) {
            return null;
        }
        SeriesResponse response = new SeriesResponse();
        response.setId(entity.getId());
        response.setName(entity.getName());
        response.setSlug(entity.getSlug());
        response.setStatus(entity.getStatus());
        return response;
    }

    public SeriesProductResponse toSeriesProductResponse(Series entity) {
        if (entity == null) {
            return null;
        }
        return new SeriesProductResponse(entity.getId(), entity.getName(), entity.getSlug());
    }
}
