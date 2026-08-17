package com.dev.backend.modules.series.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dev.backend.common.response.PageResponse;
import com.dev.backend.common.response.ResponseData;
import com.dev.backend.common.response.ResponseUtil;
import com.dev.backend.modules.series.dto.SeriesFilterRequest;
import com.dev.backend.modules.series.dto.SeriesProductResponse;
import com.dev.backend.modules.series.dto.SeriesRequest;
import com.dev.backend.modules.series.dto.SeriesResponse;
import com.dev.backend.modules.series.service.SeriesService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1")
public class SeriesController {
    private final SeriesService seriesService;

    @GetMapping("/admin/series/filter")
    public ResponseEntity<ResponseData<PageResponse<SeriesResponse>>> search(
            @ModelAttribute SeriesFilterRequest request) {
        PageResponse<SeriesResponse> response = seriesService.search(request);
        return ResponseUtil.success("Lấy danh sách series thành công", response);
    }

    @PostMapping("/admin/series")
    public ResponseEntity<ResponseData<SeriesResponse>> add(@RequestBody @Valid SeriesRequest request) {
        SeriesResponse response = seriesService.create(request);
        return ResponseUtil.success("Thêm series thành công.", response);
    }

    @PutMapping("/admin/series/{id}")
    public ResponseEntity<ResponseData<SeriesResponse>> update(@PathVariable("id") Long id,
            @RequestBody @Valid SeriesRequest request) {
        SeriesResponse response = seriesService.update(id, request);
        return ResponseUtil.success("Cập nhật series thành công.", response);
    }

    @DeleteMapping("/admin/series/{id}")
    public ResponseEntity<ResponseData<Void>> delete(@PathVariable("id") Long id) {
        seriesService.delete(id);
        return ResponseUtil.success("Xoá series thành công.", null);
    }

    @GetMapping("/series")
    public ResponseEntity<ResponseData<List<SeriesProductResponse>>> getPublisherProducts() {
        List<SeriesProductResponse> data = seriesService.getSeriesWithBookCount();
        return ResponseUtil.success("Lấy danh sách thành công.", data);
    }
}
