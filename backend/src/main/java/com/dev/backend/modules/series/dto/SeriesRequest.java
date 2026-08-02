package com.dev.backend.modules.series.dto;

import com.dev.backend.common.enums.SeriesStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SeriesRequest {
    private String name;
    private SeriesStatus status;
}
