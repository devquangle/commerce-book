package com.dev.backend.modules.product.service;

import com.dev.backend.common.response.PageResponse;
import com.dev.backend.modules.author_product.service.AuthorProductService;
import com.dev.backend.modules.genre.dto.GenreResponse;
import com.dev.backend.modules.genre_product.service.GenreProductService;
import com.dev.backend.modules.image_product.service.ImageProductService;
import com.dev.backend.modules.product.dto.ProductFilterRequest;
import com.dev.backend.modules.product.dto.ProductRequest;
import com.dev.backend.modules.product.dto.ProductResponse;
import com.dev.backend.modules.product.entity.Product;
import com.dev.backend.modules.product.mapper.ProductMapper;
import com.dev.backend.modules.product.repository.ProductRepository;

import lombok.RequiredArgsConstructor;

import org.apache.commons.lang3.StringUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductServiceImpl implements ProductService {

        private final ProductRepository productRepository;
        private final ProductMapper productMapper;
        private final AuthorProductService authorProductService;
        private final GenreProductService genreProductService;
        private final ImageProductService imageProductService;

        @Override
        public ProductResponse mapToDTO(Product product) {
                ProductResponse response = productMapper.toDTO(product);
                Long productId = product.getId();
                List<String> authorsName = authorProductService.getAuthorNamesByProductId(productId);
                List<String> genresName = genreProductService.getGenreNamesByProductId(productId);
                String urlImageDefault = imageProductService.getDefaultImageUrlByProductId(productId);
                response.setAuthorsName(authorsName);
                response.setGenresName(genresName);
                response.setUrlImageDefault(urlImageDefault);
                return response;
        }

        @Override
        @Transactional(readOnly = true)
        public PageResponse<ProductResponse> searchProductsByShopId(ProductFilterRequest request, Long shopId) {
                Pageable pageable = PageRequest.of(
                                Math.max(0, Optional.ofNullable(request.getPage()).orElse(1) - 1),
                                Optional.ofNullable(request.getSize()).filter(s -> s > 0).orElse(10),
                                Sort.by(Sort.Direction.DESC, "id"));

                Page<ProductResponse> page = productRepository
                                .searchProductsByShopId(
                                                StringUtils.trimToNull(request.getKeyword()),
                                                request.getStatus(),
                                                shopId,
                                                pageable)
                                .map(this::mapToDTO);

                return new PageResponse<>(
                                page.getContent(),
                                page.getNumber(),
                                page.getSize(),
                                page.getTotalElements(),
                                page.getTotalPages());
        }

        // public String generateUniqueSlug(Integer shopId, String productName) {
        //         String baseSlug = SlugUtils.toSlug(productName);
        //         String slug = baseSlug;
        //         int index = 1;

        //         while (productRepository.existsByShopIdAndSlug(shopId, slug)) {
        //                 slug = baseSlug + "-" + index++;
        //         }

        //         return slug;
        // }
}
