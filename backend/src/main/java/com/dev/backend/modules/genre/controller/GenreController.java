package com.dev.backend.modules.genre.controller;

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
import com.dev.backend.modules.genre.dto.GenreFilterRequest;
import com.dev.backend.modules.genre.dto.GenreRequest;
import com.dev.backend.modules.genre.dto.GenreResponse;
import com.dev.backend.modules.genre.service.GenreService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1")
public class GenreController {
    private final GenreService authorService;

    @GetMapping("/admin/genres/filter")
    public ResponseEntity<ResponseData<PageResponse<GenreResponse>>> search(
            @ModelAttribute GenreFilterRequest request) {
        PageResponse<GenreResponse> response = authorService.search(request);
        return ResponseUtil.success("Lấy danh sách thể loại thành công", response);
    }

    @PostMapping("/admin/genres")
    public ResponseEntity<ResponseData<GenreResponse>> add(@RequestBody GenreRequest authorRequest) {
        GenreResponse response = authorService.create(authorRequest);
        return ResponseUtil.success("Thêm thể loại thành công.", response);
    }

    @PutMapping("/admin/genres/{id}")
    public ResponseEntity<ResponseData<GenreResponse>> update(@PathVariable("id") Long id,
            @RequestBody GenreRequest authorRequest) {
        GenreResponse response = authorService.update(id, authorRequest);
        return ResponseUtil.success("Cập nhật thể loại thành công.", response);
    }

    @DeleteMapping("/admin/genres/{id}")
    public ResponseEntity<ResponseData<Void>> delete(@PathVariable("id") Long id) {
        authorService.delete(id);
        return ResponseUtil.success("Xoá thể loại thành công.", null);
    }

}
