package com.dev.backend.modules.cloudinary.service;

import java.util.List;
import java.util.Map;

import org.springframework.web.multipart.MultipartFile;

import com.dev.backend.modules.cloudinary.dto.ImageRequest;
import com.dev.backend.modules.cloudinary.dto.ImageResponse;

public interface CloudinaryService {

        String uploadImage(MultipartFile file);

        String uploadImage(byte[] imageBytes);

        String uploadImageUrl(String imageUrl);

        List<ImageResponse> imageResponses(List<ImageRequest> imageRequests);

        Map<String, String> map(MultipartFile file,String imageUrl);


}
