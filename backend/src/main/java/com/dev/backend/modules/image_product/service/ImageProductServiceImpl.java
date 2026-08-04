package com.dev.backend.modules.image_product.service;
import com.dev.backend.modules.image_product.repository.ImageProductRepository;
import lombok.RequiredArgsConstructor;
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

}
