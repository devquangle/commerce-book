package com.dev.backend.modules.series.mapper;

import com.dev.backend.modules.series.dto.SeriesRequest;
import com.dev.backend.modules.series.dto.SeriesResponse;
import com.dev.backend.modules.series.entity.Series;
import org.springframework.stereotype.Component;

@Component
public class SeriesMapper {

    public Series toEntity(SeriesRequest request) {
        if (request == null) {
            return null;
        }
        return Series.builder()
                .name(request.getName())
                .description(request.getDescription())
                .build();
    }

    public SeriesResponse toResponse(Series entity) {
        if (entity == null) {
            return null;
        }
        return SeriesResponse.builder()
                .id(entity.getId())
                .name(entity.getName())
                .description(entity.getDescription())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    public void updateEntityFromRequest(SeriesRequest request, Series entity) {
        if (request == null || entity == null) {
            return;
        }
        if (request.getName() != null) {
            entity.setName(request.getName());
        }
        if (request.getDescription() != null) {
            entity.setDescription(request.getDescription());
        }
    }
}
