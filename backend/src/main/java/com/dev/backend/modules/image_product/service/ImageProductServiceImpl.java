package com.dev.backend.modules.image_product.service;

import com.dev.backend.modules.cloudinary.dto.ImageResponse;
import com.dev.backend.modules.cloudinary.service.CloudinaryService;
import com.dev.backend.modules.image_product.dto.ImageProductResponse;
import com.dev.backend.modules.image_product.entity.ImageProduct;
import com.dev.backend.modules.image_product.repository.ImageProductRepository;
import com.dev.backend.modules.product.entity.Product;

import lombok.RequiredArgsConstructor;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class ImageProductServiceImpl implements ImageProductService {
    private static final String URL_DEFAULT = "https://res.cloudinary.com/dox0mkwaz/image/upload/v1782366403/vjyqfyoqhtelnbqo6x4k.jpg";
    private final ImageProductRepository imageProductRepository;
    private final CloudinaryService cloudinaryService;

    @Override
    @Transactional(readOnly = true)
    public String getDefaultImageUrlByProductId(Long productId) {
        String urlImage = imageProductRepository.findDefaultImageUrlByProductId(productId).orElse(URL_DEFAULT);
        return urlImage;
    }

    @Override
    public Map<Long, String> findThumbnailMap(List<Long> productIds) {
         return imageProductRepository.findByProductIdInAndIsThumbnailTrue(productIds)
            .stream()
            .collect(Collectors.toMap(
                    item -> item.getProduct().getId(),
                        item -> item.getUrlImage()
            ));
    }

    @Override
    public List<ImageProductResponse> getImageResponsesByProductId(Long productId) {
        return imageProductRepository.findImageResponsesByProductId(productId);
    }

    @Override
    public void setImagesProduct(Product product, List<ImageResponse> imageResponses) {
        // 1. Lấy tất cả ảnh hiện tại đang lưu dưới DB của Product này
        List<ImageProduct> existingImages = imageProductRepository.findByProductId(product.getId());

        // Nếu danh sách mới trống -> Người dùng đã xóa sạch ảnh của sản phẩm này trên
        // UI
        if (imageResponses == null || imageResponses.isEmpty()) {
            if (!existingImages.isEmpty()) {
                deleteImagesFromCloudinary(existingImages);
                imageProductRepository.deleteAll(existingImages);
            }
            return;
        }

        // 2. Gom tất cả URL mới từ ImageResponse gửi lên thành một danh sách để đối
        // chiếu
        List<String> newUrls = imageResponses.stream()
            .map(item -> item.getUrl())
                .filter(url -> url != null && !url.isBlank())
                .toList();

        // 📌 HÀNH ĐỘNG 1: TÌM ẢNH CẦN XÓA
        // Ảnh nào đang có dưới DB nhưng KHÔNG nằm trong danh sách mới gửi lên -> Bị xóa
        List<ImageProduct> toDelete = existingImages.stream()
                .filter(img -> !newUrls.contains(img.getUrlImage()))
                .toList();

        if (!toDelete.isEmpty()) {
            deleteImagesFromCloudinary(toDelete);
            imageProductRepository.deleteAll(toDelete);
        }

        // 3. Phân loại để THÊM MỚI hoặc CẬP NHẬT trạng thái Thumbnail
        List<ImageProduct> toSave = new ArrayList<>();

        for (ImageResponse item : imageResponses) {
            if (item.getUrl() == null || item.getUrl().isBlank()) {
                continue;
            }

            Optional<ImageProduct> existingImageOpt = existingImages.stream()
                    .filter(img -> img.getUrlImage().equals(item.getUrl()))
                    .findFirst();

            if (existingImageOpt.isPresent()) {
                ImageProduct existingImage = existingImageOpt.get();
                if (existingImage.isThumbnail() != item.isThumbnail()) {
                    existingImage.setThumbnail(item.isThumbnail());
                    toSave.add(existingImage);
                }
            } else {
                ImageProduct newImage = new ImageProduct();
                newImage.setUrlImage(item.getUrl());
                newImage.setThumbnail(item.isThumbnail());
                newImage.setPublicId(item.getPublicId());
                newImage.setProduct(product);
                toSave.add(newImage);
            }
        }

        if (!toSave.isEmpty()) {
            imageProductRepository.saveAll(toSave);
        }
    }

    @Override
    public void deleteImagesByProductId(Long productId) {
        List<ImageProduct> existingImages = imageProductRepository.findByProductId(productId);
        if (existingImages != null && !existingImages.isEmpty()) {
            deleteImagesFromCloudinary(existingImages);
            imageProductRepository.deleteAll(existingImages);
        }
    }

    private void deleteImagesFromCloudinary(List<ImageProduct> images) {
        if (images == null || images.isEmpty()) {
            return;
        }
        List<String> publicIdsToDelete = images.stream()
                .map(img -> (img.getPublicId() != null && !img.getPublicId().isBlank())
                        ? img.getPublicId()
                        : cloudinaryService.extractPublicIdFromUrl(img.getUrlImage()))
                .filter(id -> id != null && !id.isBlank())
                .toList();

        if (!publicIdsToDelete.isEmpty()) {
            cloudinaryService.deletePublicIds(publicIdsToDelete);
        }
    }
}
