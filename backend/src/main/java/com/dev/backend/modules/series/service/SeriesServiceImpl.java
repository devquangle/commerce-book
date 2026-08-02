package com.dev.backend.modules.series.service;

import com.dev.backend.common.enums.SeriesStatus;
import com.dev.backend.common.exception.BadRequestException;
import com.dev.backend.common.exception.DuplicateFieldException;
import com.dev.backend.common.response.PageResponse;
import com.dev.backend.common.utils.TextUtils;
import com.dev.backend.modules.series.dto.SeriesFilterRequest;
import com.dev.backend.modules.series.dto.SeriesRequest;
import com.dev.backend.modules.series.dto.SeriesResponse;
import com.dev.backend.modules.series.entity.Series;
import com.dev.backend.modules.series.mapper.SeriesMapper;
import com.dev.backend.modules.series.repository.SeriesRepository;

import lombok.RequiredArgsConstructor;

import org.apache.commons.lang3.StringUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
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
                .map(seriesMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public boolean existsByName(String name) {
        return seriesRepository.existsByName(name);
    }

    @Override
    public void validate(SeriesRequest request) {
        DuplicateFieldException errors = new DuplicateFieldException(new HashMap<>());
        if (existsByName(request.getName())) {
            errors.addError("name", "Tên series đã được sử dụng.");
        }
        if (!errors.getErrors().isEmpty()) {
            throw errors;
        }

    }

    @Override
    public Series getById(Long id) {
        return seriesRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Series not found with id: " + id));
    }

    @Override
    public SeriesResponse create(SeriesRequest request) {
        Series series = new Series();
        validate(request);
        seriesMapper.toEntity(series, request);
        series.setStatus(SeriesStatus.ACTIVE);
        return seriesMapper.toDTO(seriesRepository.save(series));
    }

    @Override
    public SeriesResponse update(Long id, SeriesRequest request) {
        Series series = getById(id);
        if (request.getStatus() == SeriesStatus.DELETED) {
            throw new BadRequestException("Không được cập nhật sang trạng thái DELETED");
        }
        String newName = TextUtils.capitalizeFully(request.getName());
        if (!series.getName().equals(newName)) {
            validate(request);
        }
        seriesMapper.toEntity(series, request);
        return seriesMapper.toDTO(seriesRepository.save(series));
    }

    @Override
    public void delete(Long id) {
        Series series = getById(id);
        series.setStatus(SeriesStatus.DELETED);
        seriesRepository.save(series);
    }

    @Override
    public void insertData() {
        if (seriesRepository.count() > 0) {
            return;
        }

        List<Series> items = List.of(
                createSeries("Khác"),

                // Việt Nam
                createSeries("Kính Vạn Hoa"),
                createSeries("Chuyện Xứ Lang Biang"),
                createSeries("Mắt Biếc"),
                createSeries("Tôi Thấy Hoa Vàng Trên Cỏ Xanh"),

                // Nhật Bản - Manga
                createSeries("Doraemon"),
                createSeries("Thám Tử Lừng Danh Conan"),
                createSeries("One Piece"),
                createSeries("Naruto"),
                createSeries("Dragon Ball"),
                createSeries("Attack on Titan"),
                createSeries("Demon Slayer"),
                createSeries("Jujutsu Kaisen"),
                createSeries("My Hero Academia"),
                createSeries("Slam Dunk"),

                // Tiểu thuyết quốc tế
                createSeries("Harry Potter"),
                createSeries("Chúa Tể Những Chiếc Nhẫn"),
                createSeries("The Hobbit"),
                createSeries("The Chronicles of Narnia"),
                createSeries("Percy Jackson"),
                createSeries("A Song of Ice and Fire"),
                createSeries("The Hunger Games"),
                createSeries("Dune"),
                createSeries("Sherlock Holmes"));

        seriesRepository.saveAll(items);
    }

    private Series createSeries(String name) {
        Series series = new Series();
        series.setName(TextUtils.capitalizeFully(name));
        series.setSlug(TextUtils.toSlug(name));
        series.setStatus(SeriesStatus.ACTIVE);
        return series;
    }

    @Override
    public PageResponse<SeriesResponse> search(SeriesFilterRequest request) {
        int page = (request.getPage() == null || request.getPage() < 1) ? 0 : request.getPage() - 1;
        int size = (request.getSize() == null || request.getSize() < 1) ? 10 : request.getSize();

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));

        SeriesStatus status = request.getStatus();
        String keyword = StringUtils.trimToNull(request.getKeyword());
        Page<Series> item = seriesRepository.search(keyword, status, pageable);

        List<SeriesResponse> items = item.getContent().stream().map(seriesMapper::toDTO).toList();

        return new PageResponse<>(
                items,
                item.getNumber(),
                item.getSize(),
                item.getTotalElements(),
                item.getTotalPages());
    }
}
