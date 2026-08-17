package com.dev.backend.modules.author_product.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dev.backend.common.response.ResponseData;
import com.dev.backend.common.response.ResponseUtil;
import com.dev.backend.modules.author_product.dto.AuthorProductResponse;
import com.dev.backend.modules.author_product.service.AuthorProductService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1")
public class AuthorProductController {
    private final AuthorProductService authorProductService;

    @GetMapping("/authors")
    public ResponseEntity<ResponseData<List<AuthorProductResponse>>> getAuthorProducts() {
        List<AuthorProductResponse> data = authorProductService.getAuthorsWithBookCount();
        return ResponseUtil.success("Lấy danh sách thành công.", data);
    }
}
