package com.dev.backend.modules.cloudinary.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.dev.backend.common.response.ResponseData;
import com.dev.backend.common.response.ResponseUtil;
import com.dev.backend.modules.cloudinary.service.CloudinaryService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/")
@RequiredArgsConstructor
public class CloudinaryController {
    private final CloudinaryService cloudinaryService;

    @PostMapping("/upload-file")
    public ResponseEntity<ResponseData<String>> postUploadImage(
            @RequestPart(value = "file", required = false) MultipartFile file) {
        return ResponseUtil.success("Upload pass", cloudinaryService.uploadImage(file));
    }

    @PostMapping("/upload-url")
    public ResponseEntity<ResponseData<String>> upload(
            @RequestParam(value = "url", required = false) String url) {
        return ResponseUtil.success("Tải ảnh thành công", cloudinaryService.uploadImageUrl(url));
    }

}
