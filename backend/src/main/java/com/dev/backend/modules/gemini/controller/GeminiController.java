package com.dev.backend.modules.gemini.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.dev.backend.common.response.ResponseData;
import com.dev.backend.common.response.ResponseUtil;
import com.dev.backend.modules.gemini.dto.BookMetaRequest;
import com.dev.backend.modules.gemini.dto.BookMetaResponse;
import com.dev.backend.modules.gemini.service.GeminiService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/gemini")
public class GeminiController {
    private final GeminiService geminiService;

    @GetMapping("/book-meta")
    public ResponseEntity<ResponseData<BookMetaResponse>> getBookMeta(@ModelAttribute BookMetaRequest request) {
        BookMetaResponse response = geminiService.generateBookMeta(request);
        return ResponseUtil.success("Lấy dữ liệu thành công", response);
    }
}
