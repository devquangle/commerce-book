package com.dev.backend.modules.series.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.dev.backend.common.enums.SeriesStatus;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SeriesResponse {
    private Long id;
    private String name;
    private String slug;
    private SeriesStatus status;
}
