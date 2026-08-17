package com.dev.backend.modules.genre_product.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dev.backend.common.response.ResponseData;
import com.dev.backend.common.response.ResponseUtil;
import com.dev.backend.modules.genre_product.dto.GenreProductResponse;
import com.dev.backend.modules.genre_product.service.GenreProductService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1")
public class GenreProductController {
     private final GenreProductService genreProductService;

    @GetMapping("/genres")
    public ResponseEntity<ResponseData<List<GenreProductResponse>>> getAuthorProducts() {
        List<GenreProductResponse> data = genreProductService.getGenresWithBookCount();
        return ResponseUtil.success("Lấy danh sách thành công.", data);
    }
}
