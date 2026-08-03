package com.dev.backend.modules.search_api.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.dev.backend.common.response.ResponseData;
import com.dev.backend.common.response.ResponseUtil;
import com.dev.backend.modules.search_api.dto.UrlImageResponse;
import com.dev.backend.modules.search_api.service.SearchApiService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/search-api")
public class SearchApiController {
    private final SearchApiService searchApiService;
    @GetMapping("/book-images")
    public ResponseEntity<ResponseData<UrlImageResponse>> getUrlImages(@RequestParam("name") String name) {
        UrlImageResponse images = searchApiService.getTop5ImageLinks(name);
        return ResponseUtil.success("Lấy dữ liệu thành công", images);
    }
}
