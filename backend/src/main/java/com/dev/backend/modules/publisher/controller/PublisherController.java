package com.dev.backend.modules.publisher.controller;

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
import com.dev.backend.modules.publisher.dto.PublisherFilterRequest;
import com.dev.backend.modules.publisher.dto.PublisherProductResponse;
import com.dev.backend.modules.publisher.dto.PublisherRequest;
import com.dev.backend.modules.publisher.dto.PublisherResponse;
import com.dev.backend.modules.publisher.service.PublisherService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1")
public class PublisherController {
    private final PublisherService publisherService;

    @GetMapping("/admin/publishers/filter")
    public ResponseEntity<ResponseData<PageResponse<PublisherResponse>>> search(
            @ModelAttribute PublisherFilterRequest request) {
        PageResponse<PublisherResponse> response = publisherService.search(request);
        return ResponseUtil.success("Lấy danh sách nhà xuất bản thành công", response);
    }

    @PostMapping("/admin/publishers")
    public ResponseEntity<ResponseData<PublisherResponse>> add(@RequestBody PublisherRequest request) {
        PublisherResponse response = publisherService.create(request);
        return ResponseUtil.success("Thêm nhà xuất bản thành công.", response);
    }

    @PutMapping("/admin/publishers/{id}")
    public ResponseEntity<ResponseData<PublisherResponse>> update(@PathVariable("id") Long id,
            @RequestBody PublisherRequest request) {
        PublisherResponse response = publisherService.update(id, request);
        return ResponseUtil.success("Cập nhật nhà xuất bản thành công.", response);
    }

    @DeleteMapping("/admin/publishers/{id}")
    public ResponseEntity<ResponseData<Void>> delete(@PathVariable("id") Long id) {
        publisherService.delete(id);
        return ResponseUtil.success("Xoá nhà xuất bản thành công.", null);
    }

    @GetMapping("/publishers")
    public ResponseEntity<ResponseData<List<PublisherProductResponse>>> getPublishersWithProducts() {
        List<PublisherProductResponse> data = publisherService.getPublishersWithProducts();
        return ResponseUtil.success("Lấy danh sách thành công.", data);
    }
}
