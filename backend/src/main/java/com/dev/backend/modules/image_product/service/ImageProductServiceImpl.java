package com.dev.backend.modules.image_product.service;

import com.dev.backend.modules.cloudinary.dto.ImageResponse;
import com.dev.backend.modules.image_product.entity.ImageProduct;
import com.dev.backend.modules.image_product.repository.ImageProductRepository;
import com.dev.backend.modules.product.entity.Product;

import lombok.RequiredArgsConstructor;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class ImageProductServiceImpl implements ImageProductService {
    private static final String URL_DEFAULT = "https://res.cloudinary.com/dox0mkwaz/image/upload/v1782366403/vjyqfyoqhtelnbqo6x4k.jpg";
    private final ImageProductRepository imageProductRepository;

    @Override
    @Transactional(readOnly = true)
    public String getDefaultImageUrlByProductId(Long productId) {
        String urlImage = imageProductRepository.findDefaultImageUrlByProductId(productId).orElse(URL_DEFAULT);
        return urlImage;
    }

    @Override
    public void setImagesProduct(Product product, List<ImageResponse> imageResponses) {
        // 1. Lấy tất cả ảnh hiện tại đang lưu dưới DB của Product này
        List<ImageProduct> existingImages = imageProductRepository.findByProductId(product.getId());

        // Nếu danh sách mới trống -> Người dùng đã xóa sạch ảnh của sản phẩm này trên
        // UI
        if (imageResponses == null || imageResponses.isEmpty()) {
            if (!existingImages.isEmpty()) {
                imageProductRepository.deleteAll(existingImages);
            }
            return;
        }

        // 2. Gom tất cả URL mới từ ImageResponse gửi lên thành một danh sách để đối
        // chiếu
        List<String> newUrls = imageResponses.stream()
                .map(item -> item.url()) // Gọi đúng method url() từ Record của bạn
                .filter(url -> url != null && !url.isBlank())
                .toList();

        // 📌 HÀNH ĐỘNG 1: TÌM ẢNH CẦN XÓA
        // Ảnh nào đang có dưới DB nhưng KHÔNG nằm trong danh sách mới gửi lên -> Bị xóa
        List<ImageProduct> toDelete = existingImages.stream()
                .filter(img -> !newUrls.contains(img.getUrlImage()))
                .toList();

        // 3. Phân loại để THÊM MỚI hoặc CẬP NHẬT trạng thái Thumbnail
        List<ImageProduct> toSave = new ArrayList<>();

        for (ImageResponse item : imageResponses) {
            if (item.url() == null || item.url().isBlank()) {
                continue; // Bỏ qua nếu dữ liệu lỗi không có URL
            }

            // Tìm xem URL từ Cloudinary này đã tồn tại dưới DB của Product này chưa
            Optional<ImageProduct> existingImageOpt = existingImages.stream()
                    .filter(img -> img.getUrlImage().equals(item.url()))
                    .findFirst();

            if (existingImageOpt.isPresent()) {
                // 📌 HÀNH ĐỘNG 2: CẬP NHẬT TRẠNG THÁI THUMBNAIL
                // Ảnh cũ vẫn giữ lại, nhưng check xem người dùng có thay đổi nút tích chọn ảnh
                // đại diện hay không
                ImageProduct existingImage = existingImageOpt.get();
                if (existingImage.isThumbnail() != item.isThumbnail()) { // Gọi đúng item.isThumbnail() từ Record của
                                                                         // bạn
                    existingImage.setThumbnail(item.isThumbnail());
                    toSave.add(existingImage); // Thêm vào danh sách để UPDATE
                }
            } else {
                // 📌 HÀNH ĐỘNG 3: THÊM MỚI BẢN GHI
                // URL này hoàn toàn mới (Do Frontend vừa up lên Cloudinary thành công rồi
                // truyền vào đây)
                ImageProduct newImage = new ImageProduct();
                newImage.setUrlImage(item.url());
                newImage.setThumbnail(item.isThumbnail());
                newImage.setProduct(product);
                toSave.add(newImage); // Thêm vào danh sách để INSERT
            }
        }

        // 4. Đồng bộ tất cả thay đổi xuống Database
        if (!toDelete.isEmpty()) {
            imageProductRepository.deleteAll(toDelete); // Bắn lệnh DELETE
        }

        if (!toSave.isEmpty()) {
            imageProductRepository.saveAll(toSave); // Tự động INSERT bản ghi mới và UPDATE bản ghi cũ có sự thay đổi
        }
    }

}
