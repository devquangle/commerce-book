package com.dev.backend.modules.author.controller;

import org.springframework.http.ResponseEntity;
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
import com.dev.backend.modules.author.dto.AuthorFilterRequest;
import com.dev.backend.modules.author.dto.AuthorRequest;
import com.dev.backend.modules.author.dto.AuthorResponse;
import com.dev.backend.modules.author.service.AuthorService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1")
public class AuthorController {
    private final AuthorService authorService;

    @GetMapping("/admin/authors/filter")
    public ResponseEntity<ResponseData<PageResponse<AuthorResponse>>> search(
            @ModelAttribute AuthorFilterRequest request) {
        PageResponse<AuthorResponse> response = authorService.search(request);
        return ResponseUtil.success("Lấy danh sách tác giả thành công", response);
    }

    @PostMapping("/admin/authors")
    public ResponseEntity<ResponseData<AuthorResponse>> add(@RequestBody AuthorRequest authorRequest) {
        AuthorResponse response = authorService.create(authorRequest);
        return ResponseUtil.success("Thêm tác giả thành công.", response);
    }

    @PutMapping("/admin/authors/{id}")
    public ResponseEntity<ResponseData<AuthorResponse>> update(@PathVariable("id") Long id,
            @RequestBody AuthorRequest authorRequest) {
        AuthorResponse response = authorService.update(id, authorRequest);
        return ResponseUtil.success("Cập nhật tác giả thành công.", response);
    }

}
