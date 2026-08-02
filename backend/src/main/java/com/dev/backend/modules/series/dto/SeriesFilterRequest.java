package com.dev.backend.modules.series.dto;

import com.dev.backend.common.enums.SeriesStatus;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SeriesFilterRequest {
    private String keyword;
    private SeriesStatus status;
    private Integer page;
    private Integer size;
}
