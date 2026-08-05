package com.dev.backend.modules.cloudinary.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.dev.backend.modules.cloudinary.dto.ImageRequest;
import com.dev.backend.modules.cloudinary.dto.ImageResponse;
import com.dev.backend.modules.cloudinary.dto.UploadImageResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CloudinaryServiceImpl implements CloudinaryService {

    // Đường dẫn ảnh mặc định khi không tìm thấy hoặc lỗi hệ thống bên thứ ba
    private static final String DEFAULT_AVATAR_URL = "https://ui-avatars.com/api/?name=Kh%C3%A1c&background=random&color=fff&size=128";

    private final Cloudinary cloudinary;

    @Value("${cloudinary.cloud-name}")
    private String cloudName;

    @Override
    public UploadImageResponse uploadImage(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return new UploadImageResponse(DEFAULT_AVATAR_URL, null);
        }
        try {
            Map<?, ?> result = cloudinary.uploader()
                    .upload(file.getBytes(), ObjectUtils.emptyMap());

            return new UploadImageResponse(
                    result.get("secure_url").toString(),
                    result.get("public_id").toString());
        } catch (Exception e) {
            throw new RuntimeException("Upload ảnh thất bại: " + e.getMessage(), e);
        }
    }

    @Override
    public UploadImageResponse uploadImage(byte[] imageBytes) {
        if (imageBytes == null || imageBytes.length == 0) {
            return new UploadImageResponse(DEFAULT_AVATAR_URL, null);
        }
        try {
            Map<?, ?> result = cloudinary.uploader()
                    .upload(imageBytes, ObjectUtils.emptyMap());

            return new UploadImageResponse(
                    result.get("secure_url").toString(),
                    result.get("public_id").toString());
        } catch (Exception e) {
            throw new RuntimeException("Upload thất bại", e);
        }
    }

    @Override
    public UploadImageResponse uploadImageUrl(String imageUrl) {
        if (imageUrl == null || imageUrl.isBlank()) {
            throw new IllegalArgumentException("Đường dẫn URL không được để trống");
        }

        String cleanedUrl = imageUrl.strip();

        // Nếu đã là ảnh Cloudinary của bạn
        if (cleanedUrl.contains("res.cloudinary.com/" + cloudName)) {
            return new UploadImageResponse(
                    cleanedUrl,
                    extractPublicIdFromUrl(cleanedUrl));
        }

        try {
            // Cloudinary SDK hỗ trợ truyền trực tiếp URL
            Map<?, ?> result = cloudinary.uploader().upload(cleanedUrl, ObjectUtils.emptyMap());

            return new UploadImageResponse(
                    result.get("secure_url").toString(),
                    result.get("public_id").toString());
        } catch (Exception e) {
            System.err.println("Upload ảnh từ URL thất bại: " + e.getMessage());

            return new UploadImageResponse(
                    DEFAULT_AVATAR_URL,
                    null);
        }
    }

    @Override
    public UploadImageResponse map(MultipartFile file, String imageUrl) {
        if (file != null && !file.isEmpty()) {
            return uploadImage(file);
        } else if (imageUrl != null && !imageUrl.isBlank()) {
            return uploadImageUrl(imageUrl);
        } else {
            return new UploadImageResponse(DEFAULT_AVATAR_URL, null);
        }
    }

    @Override
    public List<ImageResponse> imageResponses(List<ImageRequest> imageRequests) {
        List<ImageResponse> responses = new ArrayList<>();

        if (imageRequests == null || imageRequests.isEmpty()) {
            return responses;
        }

        for (ImageRequest req : imageRequests) {

            String finalUrl = req.getUrl();
            String publicId = null;

            if (req.getFile() != null && !req.getFile().isEmpty()) {

                UploadImageResponse upload = uploadImage(req.getFile());
                finalUrl = upload.getUrl();
                publicId = upload.getPublicId();

            } else if (finalUrl != null && !finalUrl.isBlank()) {

                String trimmedUrl = finalUrl.strip();

                if (!trimmedUrl.contains("res.cloudinary.com/" + cloudName)) {

                    UploadImageResponse upload = uploadImageUrl(trimmedUrl);
                    finalUrl = upload.getUrl();
                    publicId = upload.getPublicId();

                } else {
                    publicId = extractPublicIdFromUrl(trimmedUrl);
                    finalUrl = trimmedUrl;
                }
            }

            responses.add(new ImageResponse(
                    finalUrl,
                    publicId,
                    req.isThumbnail()));
        }

        return responses;
    }

    @Override
    public void deletePublicId(String publicId) {
        if (publicId == null || publicId.isBlank()) {
            return;
        }

        try {
            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
        } catch (Exception e) {
            throw new RuntimeException("Không thể xóa ảnh trên Cloudinary", e);
        }
    }

    @Override
    public void deletePublicIds(List<String> publicIds) {
        if (publicIds == null || publicIds.isEmpty()) {
            return;
        }

        List<String> validIds = publicIds.stream()
                .filter(id -> id != null && !id.isBlank())
                .toList();

        if (validIds.isEmpty()) {
            return;
        }

        try {
            cloudinary.api().deleteResources(validIds, ObjectUtils.emptyMap());
        } catch (Exception e) {
            System.err.println("Không thể xóa danh sách ảnh: " + e.getMessage());
        }
    }

    @Override
    public String extractPublicIdFromUrl(String url) {
        if (url == null || url.isBlank() || !url.contains("/upload/")) {
            return null;
        }
        try {
            String path = url.substring(url.indexOf("/upload/") + 8);
            if (path.matches("^v\\d+/.*")) {
                path = path.substring(path.indexOf('/') + 1);
            }
            int lastDot = path.lastIndexOf('.');
            if (lastDot != -1) {
                path = path.substring(0, lastDot);
            }
            return path;
        } catch (Exception e) {
            return null;
        }
    }
}