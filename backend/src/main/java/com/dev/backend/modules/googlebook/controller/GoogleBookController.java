package com.dev.backend.modules.googlebook.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.dev.backend.common.response.ResponseData;
import com.dev.backend.common.response.ResponseUtil;
import com.dev.backend.modules.googlebook.dto.GoogleBookResponse;
import com.dev.backend.modules.googlebook.service.GoogleBookService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1")
public class GoogleBookController {
    private final GoogleBookService googleBookService;

    @GetMapping("/google-books")
    public ResponseEntity<ResponseData<List<GoogleBookResponse>>> search(@RequestParam("query") String query) {
        List<GoogleBookResponse> response = googleBookService.searchBooks(query);
        return ResponseUtil.success("Lấy dữ liệu thành công", response);
    }
}
