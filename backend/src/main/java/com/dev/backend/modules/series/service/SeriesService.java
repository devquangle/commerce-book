package com.dev.backend.modules.series.service;

import com.dev.backend.modules.series.dto.SeriesRequest;
import com.dev.backend.modules.series.dto.SeriesResponse;

import java.util.List;

public interface SeriesService {
    List<SeriesResponse> getAllSeries();
    SeriesResponse getSeriesById(Long id);
    SeriesResponse getSeriesByName(String name);
    SeriesResponse createSeries(SeriesRequest request);
    SeriesResponse updateSeries(Long id, SeriesRequest request);
    void deleteSeries(Long id);
}
