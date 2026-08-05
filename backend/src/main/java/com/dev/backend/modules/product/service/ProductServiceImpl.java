package com.dev.backend.modules.product.service;

import com.dev.backend.common.enums.ProductStatus;
import com.dev.backend.common.exception.DuplicateFieldException;
import com.dev.backend.common.exception.NotFoundException;
import com.dev.backend.common.response.PageResponse;
import com.dev.backend.modules.author_product.service.AuthorProductService;
import com.dev.backend.modules.genre_product.service.GenreProductService;
import com.dev.backend.modules.image_product.dto.ImageProductResponse;
import com.dev.backend.modules.image_product.service.ImageProductService;
import com.dev.backend.modules.product.dto.ProductDetailResponse;
import com.dev.backend.modules.product.dto.ProductFilterRequest;
import com.dev.backend.modules.product.dto.ProductRequest;
import com.dev.backend.modules.product.dto.ProductResponse;
import com.dev.backend.modules.product.dto.ProductShopResponse;
import com.dev.backend.modules.product.entity.Product;
import com.dev.backend.modules.product.mapper.ProductMapper;
import com.dev.backend.modules.product.repository.ProductRepository;
import com.dev.backend.modules.publisher.service.PublisherService;
import com.dev.backend.modules.series.service.SeriesService;
import com.dev.backend.modules.shop.dto.ShopSimpleResponse;
import com.dev.backend.modules.shop.entity.Shop;

import lombok.RequiredArgsConstructor;

import org.apache.commons.lang3.StringUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductServiceImpl implements ProductService {

        private final ProductRepository productRepository;
        private final ProductMapper productMapper;

        private final PublisherService publisherService;
        private final SeriesService seriesService;

        private final AuthorProductService authorProductService;
        private final GenreProductService genreProductService;
        private final ImageProductService imageProductService;

        @Override
        @Transactional(readOnly = true)
        public List<ProductShopResponse> findByIdIn(List<Long> productIds) {
                return productRepository.findByIdIn(productIds)
                                .stream()
                                .map(product -> new ProductShopResponse(
                                                product.getId(),
                                                new ShopSimpleResponse(
                                                                product.getShop().getName(),
                                                                product.getShop().getSlug())))
                                .toList();
        }

        @Override
        public Product getProductBySlugAndShopId(String slug, Long shopId) {
                return productRepository.findProductBySlugAndShopId(slug, shopId)
                                .orElseThrow(() -> new NotFoundException("Product not found slug " + slug));
        }

        @Override
        public Product getProductByIdAndShopId(Long id, Long shopId) {
                return productRepository.findProductByIdAndShopId(id, shopId)
                                .orElseThrow(() -> new NotFoundException("Product not found id " + id));
        }

        @Override
        public void validate(ProductRequest request) {
                DuplicateFieldException errors = new DuplicateFieldException(new HashMap<>());
                if (request.getWeight() > 50000) {
                        errors.addError("weight", "Cân nặng không vượt quá 50000.");
                }
                if (!errors.getErrors().isEmpty()) {
                        throw errors;
                }
        }

        @Override
        @Transactional(readOnly = true)
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
        public ProductDetailResponse detail(String slug, Long shopId) {
                Product product = getProductBySlugAndShopId(slug, shopId);
                Long productId = product.getId();
                ProductDetailResponse response = productMapper.toDetailDTO(product);
                List<Long> authorIds = authorProductService.getAuthorIdsByProductId(productId);
                List<Long> genreIds = genreProductService.getGenreIdsByProductId(productId);
                List<ImageProductResponse> images = imageProductService.getImageResponsesByProductId(productId);
                response.setAuthorIds(authorIds);
                response.setGenreIds(genreIds);
                response.setCoverImages(images);
                return response;
        }

        @Override
        @Transactional
        public ProductResponse create(ProductRequest request, Shop shop) {
                Product product = new Product();
                validate(request);
                product.setShop(shop);
                product.setStatus(ProductStatus.PENDING_APPROVAL);
                Product saved = saveProduct(product, request, shop.getId());
                return productMapper.toDTO(saved);

        }

        @Override
        @Transactional
        public ProductResponse update(Long id, ProductRequest request, Long shopId) {
                Product product = getProductByIdAndShopId(id, shopId);
                validate(request);
                product.setStatus(request.getStatus());
                Product saved = saveProduct(product, request, shopId);
                return productMapper.toDTO(saved);
        }

        @Override
        @Transactional
        public void delete(Long id, Long shopId) {
                Product product = getProductByIdAndShopId(id, shopId);
                product.setStatus(ProductStatus.DELETED);
                productRepository.save(product);
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

        @Override
        public PageResponse<ProductResponse> searchProducts(ProductFilterRequest request) {
                // TODO Auto-generated method stub
                return null;
        }

        public String generateUniqueSlug(Long shopId, String slug) {
                int index = 1;
                while (productRepository.existsByShopIdAndSlug(shopId, slug)) {
                        slug = slug + "-" + index++;
                }

                return slug;
        }

        private Product saveProduct(Product product, ProductRequest request, Long shopId) {
                String oldName = product.getName();
                productMapper.toEntity(product, request);

                if (!Objects.equals(oldName, product.getName())) {
                        product.setSlug(generateUniqueSlug(shopId, product.getSlug()));
                }
                product.setPublisher(publisherService.getById(request.getPublisherId()));
                product.setSeries(
                                request.getSeriesId() != null
                                                ? seriesService.getById(request.getSeriesId())
                                                : null);

                Product savedProduct = productRepository.save(product);

                authorProductService.setAuthorsProduct(savedProduct, request.getAuthorIds());
                genreProductService.setGenresProduct(savedProduct, request.getGenreIds());
                imageProductService.setImagesProduct(savedProduct, request.getCoverImages());

                return savedProduct;
        }
}
