package com.dev.backend.modules.cloudinary.service;

import java.net.URI;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import org.springframework.beans.factory.annotation.Value;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.dev.backend.modules.cloudinary.dto.ImageRequest;
import com.dev.backend.modules.cloudinary.dto.ImageResponse;

import jakarta.annotation.PostConstruct;

@Service
public class CloudinaryServiceImpl implements CloudinaryService {

    // Đường dẫn ảnh mặc định khi không tìm thấy hoặc lỗi hệ thống bên thứ ba
    private static final String DEFAULT_AVATAR_URL = "https://ui-avatars.com/api/?name=Kh%C3%A1c&background=random&color=fff&size=128";

    @Value("${cloudinary.cloud-name}")
    private String cloudName;

    @Value("${cloudinary.api-key}")
    private String apiKey;

    @Value("${cloudinary.api-secret}")
    private String apiSecret;

    private Cloudinary cloudinary;

    @PostConstruct
    public void init() {
        cloudinary = new Cloudinary(ObjectUtils.asMap(
                "cloud_name", cloudName,
                "api_key", apiKey,
                "api_secret", apiSecret));
    }

    @Override
    public String uploadImage(MultipartFile file) {
        try {
            if (file == null || file.isEmpty()) {
                throw new IllegalArgumentException("File upload không được để trống");
            }
            return (String) cloudinary.uploader()
                    .upload(file.getBytes(), ObjectUtils.emptyMap())
                    .get("secure_url");
        } catch (Exception e) {
            System.err.println("Lỗi khi upload MultipartFile lên Cloudinary: " + e.getMessage());
            throw new RuntimeException("Upload ảnh thất bại: " + e.getMessage(), e);
        }
    }

    @Override
    public String uploadImage(byte[] imageBytes) {
        try {
            if (imageBytes == null || imageBytes.length == 0) {
                throw new IllegalArgumentException("Dữ liệu byte ảnh không được để trống");
            }
            return cloudinary.uploader()
                    .upload(imageBytes, ObjectUtils.emptyMap())
                    .get("secure_url")
                    .toString();
        } catch (Exception e) {
            System.err.println("Lỗi khi upload byte[] lên Cloudinary: " + e.getMessage());
            throw new RuntimeException("Upload ảnh từ byte array thất bại: " + e.getMessage(), e);
        }
    }

    @Override
    public String uploadImageUrl(String imageUrl) {
        if (imageUrl == null || imageUrl.isBlank()) {
            throw new IllegalArgumentException("Đường dẫn URL không được để trống");
        }

        String cleanedUrl = imageUrl.strip();

        // Nếu ảnh đã thuộc hệ thống Cloudinary của bạn rồi thì giữ nguyên
        if (cleanedUrl.contains("res.cloudinary.com/" + cloudName)) {
            return cleanedUrl;
        }

        try {
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.set("User-Agent",
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36");

            HttpEntity<String> entity = new HttpEntity<>(headers);

            URI uri = URI.create(cleanedUrl);

            ResponseEntity<byte[]> response = restTemplate.exchange(
                    uri, // Truyền đối tượng URI vào đây thay vì cleanedUrl kiểu String
                    HttpMethod.GET,
                    entity,
                    byte[].class);

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                return this.uploadImage(response.getBody());
            }

            throw new RuntimeException("Phản hồi từ máy chủ chứa ảnh không hợp lệ: " + response.getStatusCode());

        } catch (Exception e) {
          
            System.err.println("Mã lỗi upload ảnh từ URL: " + cleanedUrl + " -> " + e.getMessage());

          
            return DEFAULT_AVATAR_URL;
        }
    }

    @Override
    public Map<String, String> map(MultipartFile file, String imageUrl) {
        String urlImage;
        if (file != null && !file.isEmpty()) {
            urlImage = uploadImage(file);
        } else if (imageUrl != null && !imageUrl.isBlank()) {
            urlImage = uploadImageUrl(imageUrl);
        } else {
            urlImage = DEFAULT_AVATAR_URL;
        }

        return Map.of("urlImage", urlImage);
    }

    @Override
    public List<ImageResponse> imageResponses(List<ImageRequest> imageRequests) {
        List<ImageResponse> responses = new ArrayList<>();

        if (imageRequests == null || imageRequests.isEmpty()) {
            return responses;
        }

        for (ImageRequest req : imageRequests) {
            String finalUrl = req.url();
            if (req.file() != null && !req.file().isEmpty()) {
                finalUrl = this.uploadImage(req.file());
            } else if (finalUrl != null && !finalUrl.isBlank()) {
                String trimmedUrl = finalUrl.strip();

                if (!trimmedUrl.contains("res.cloudinary.com/" + cloudName)) {
                    finalUrl = this.uploadImageUrl(trimmedUrl);
                }
            }

            responses.add(new ImageResponse(finalUrl, req.isThumbnail()));
        }

        return responses;
    }
}