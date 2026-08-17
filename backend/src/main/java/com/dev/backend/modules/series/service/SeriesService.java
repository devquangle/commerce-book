package com.dev.backend.modules.series.service;

import com.dev.backend.common.response.PageResponse;
import com.dev.backend.modules.series.dto.SeriesFilterRequest;
import com.dev.backend.modules.series.dto.SeriesProductResponse;
import com.dev.backend.modules.series.dto.SeriesRequest;
import com.dev.backend.modules.series.dto.SeriesResponse;
import com.dev.backend.modules.series.entity.Series;

import java.util.List;

public interface SeriesService {
    List<SeriesResponse> getAllSeries();

    Series getById(Long id);

    boolean existsByName(String name);

    void validate(SeriesRequest request);

    SeriesResponse create(SeriesRequest request);

    SeriesResponse update(Long id, SeriesRequest request);

    void delete(Long id);

    void insertData();

    PageResponse<SeriesResponse> search(SeriesFilterRequest request);

    List<SeriesProductResponse> getSeriesWithBookCount();
}
