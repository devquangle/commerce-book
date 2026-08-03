package com.dev.backend.modules.wikipedia.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.dev.backend.common.response.ResponseData;
import com.dev.backend.common.response.ResponseUtil;
import com.dev.backend.modules.wikipedia.dto.WikipediaResponse;
import com.dev.backend.modules.wikipedia.service.WikipediaService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1")
public class WikipediaController {
    private final WikipediaService wikipediaService;

    @GetMapping("/wikipedia")
    public ResponseEntity<ResponseData<WikipediaResponse>> search(@RequestParam("name") String name) {
        WikipediaResponse response = wikipediaService.fetchApiInforAuthor(name);
        return ResponseUtil.success("Lấy dữ liệu thành công", response);
    }
}
