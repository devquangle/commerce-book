package com.dev.backend.modules.cloudinary.service;

import java.util.List;
import java.util.Map;

import org.springframework.web.multipart.MultipartFile;

import com.dev.backend.modules.cloudinary.dto.ImageRequest;
import com.dev.backend.modules.cloudinary.dto.ImageResponse;
import com.dev.backend.modules.cloudinary.dto.UploadImageResponse;

public interface CloudinaryService {

        UploadImageResponse uploadImage(MultipartFile file);

        UploadImageResponse uploadImage(byte[] imageBytes);

        UploadImageResponse uploadImageUrl(String imageUrl);

        List<ImageResponse> imageResponses(List<ImageRequest> imageRequests);

        UploadImageResponse map(MultipartFile file, String imageUrl);

        void deletePublicId(String publicId);

        void deletePublicIds(List<String> publicIds);

        String extractPublicIdFromUrl(String url);

}
