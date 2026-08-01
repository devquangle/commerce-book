package com.dev.backend.modules.series.service.impl;

import com.dev.backend.modules.series.dto.SeriesRequest;
import com.dev.backend.modules.series.dto.SeriesResponse;
import com.dev.backend.modules.series.entity.Series;
import com.dev.backend.modules.series.mapper.SeriesMapper;
import com.dev.backend.modules.series.repository.SeriesRepository;
import com.dev.backend.modules.series.service.SeriesService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class SeriesServiceImpl implements SeriesService {

    private final SeriesRepository seriesRepository;
    private final SeriesMapper seriesMapper;

    @Override
    @Transactional(readOnly = true)
    public List<SeriesResponse> getAllSeries() {
        return seriesRepository.findAll().stream()
                .map(seriesMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public SeriesResponse getSeriesById(Long id) {
        Series series = seriesRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Series not found with id: " + id));
        return seriesMapper.toResponse(series);
    }

    @Override
    @Transactional(readOnly = true)
    public SeriesResponse getSeriesByName(String name) {
        Series series = seriesRepository.findByName(name)
                .orElseThrow(() -> new RuntimeException("Series not found with name: " + name));
        return seriesMapper.toResponse(series);
    }

    @Override
    public SeriesResponse createSeries(SeriesRequest request) {
        Series series = seriesMapper.toEntity(request);
        Series savedSeries = seriesRepository.save(series);
        return seriesMapper.toResponse(savedSeries);
    }

    @Override
    public SeriesResponse updateSeries(Long id, SeriesRequest request) {
        Series series = seriesRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Series not found with id: " + id));
        seriesMapper.updateEntityFromRequest(request, series);
        Series updatedSeries = seriesRepository.save(series);
        return seriesMapper.toResponse(updatedSeries);
    }

    @Override
    public void deleteSeries(Long id) {
        if (!seriesRepository.existsById(id)) {
            throw new RuntimeException("Series not found with id: " + id);
        }
        seriesRepository.deleteById(id);
    }
}
