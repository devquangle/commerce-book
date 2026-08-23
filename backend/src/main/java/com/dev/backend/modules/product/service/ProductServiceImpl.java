package com.dev.backend.modules.product.service;

import com.dev.backend.common.enums.ProductStatus;
import com.dev.backend.common.exception.BadRequestException;
import com.dev.backend.common.exception.DuplicateFieldException;
import com.dev.backend.common.exception.NotFoundException;
import com.dev.backend.common.response.PageResponse;
import com.dev.backend.common.utils.TextUtils;
import com.dev.backend.modules.author_product.dto.AuthorProductResponse;
import com.dev.backend.modules.author_product.service.AuthorProductService;
import com.dev.backend.modules.genre_product.dto.GenreProductResponse;
import com.dev.backend.modules.genre_product.service.GenreProductService;
import com.dev.backend.modules.image_product.dto.ImageProductResponse;
import com.dev.backend.modules.image_product.service.ImageProductService;
import com.dev.backend.modules.product.dto.ProductResponse;
import com.dev.backend.modules.product.dto.ProductShopResponse;
import com.dev.backend.modules.product.dto.request.ProductRequest;
import com.dev.backend.modules.product.dto.request.ShopProductFilterRequest;
import com.dev.backend.modules.product.dto.request.SuperAdminFilterRequest;
import com.dev.backend.modules.product.dto.request.UserFilterRequest;
import com.dev.backend.modules.product.dto.response.ProductCardResponse;
import com.dev.backend.modules.product.dto.response.ProductDetailResponse;
import com.dev.backend.modules.product.dto.response.ProductFullResponse;
import com.dev.backend.modules.product.dto.response.SuperAdminProductProjection;
import com.dev.backend.modules.product.dto.response.SuperAdminProductResponse;
import com.dev.backend.modules.product.entity.Product;
import com.dev.backend.modules.product.mapper.ProductMapper;
import com.dev.backend.modules.product.repository.ProductRepository;
import com.dev.backend.modules.product.repository.ProductRepositoryImpl;
import com.dev.backend.modules.promotion_product.service.PromotionProductService;
import com.dev.backend.modules.publisher.dto.PublisherProductResponse;
import com.dev.backend.modules.publisher.mapper.PublisherMapper;
import com.dev.backend.modules.publisher.service.PublisherService;
import com.dev.backend.modules.series.dto.SeriesProductResponse;
import com.dev.backend.modules.series.mapper.SeriesMapper;
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
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductServiceImpl implements ProductService {

        private final ProductRepository productRepository;
        private final ProductRepositoryImpl productRepositoryImpl;

        private final ProductMapper productMapper;
        private final PublisherMapper publisherMapper;

        private final SeriesMapper seriesMapper;
        private final PublisherService publisherService;
        private final SeriesService seriesService;
        private final AuthorProductService authorProductService;
        private final GenreProductService genreProductService;
        private final ImageProductService imageProductService;
        private final PromotionProductService promotionProductService;

        @Override
        @Transactional(readOnly = true)
        public Product getProductBySlugAndShopId(String slug, Long shopId) {
                return productRepository.findProductBySlugAndShopId(slug, shopId)
                                .orElseThrow(() -> new NotFoundException("Product not found slug " + slug));
        }

        @Override
        @Transactional(readOnly = true)
        public Product getProductByIdAndShopId(Long id, Long shopId) {
                return productRepository.findProductByIdAndShopId(id, shopId)
                                .orElseThrow(() -> new NotFoundException("Product not found id " + id));
        }

        @Override
        @Transactional(readOnly = true)
        public Product getById(Long id) {
                return productRepository.findById(id)
                                .orElseThrow(() -> new NotFoundException("Product not found id " + id));
        }

        @Override
        @Transactional(readOnly = true)
        public List<ProductShopResponse> findByIdIn(List<Long> productIds) {
                return productRepository.findByIdIn(productIds)
                                .stream()
                                .map(product -> new ProductShopResponse(
                                                product.getId(),
                                                new ShopSimpleResponse(
                                                                product.getShop().getId(),
                                                                product.getShop().getName(),
                                                                product.getShop().getSlug())))
                                .toList();
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
        public ProductFullResponse detailFull(String slug) {
                Product product = getBySlug(slug);
                Long productId = product.getId();
                ProductFullResponse response = productMapper.toProductFullResponse(product);
                List<ImageProductResponse> images = imageProductService.getImageResponsesByProductId(productId);
                List<AuthorProductResponse> authors = authorProductService.getAuthorsByProductId(productId);
                List<GenreProductResponse> genres = genreProductService.getGenresByProductId(productId);
                PublisherProductResponse publisher = publisherMapper.toPublisherProductResponse(product.getPublisher());
                SeriesProductResponse series = seriesMapper.toSeriesProductResponse(product.getSeries());
                Integer discountPercent = promotionProductService.getCurrentDiscountPercent(productId);
              
                response.setProductAuthors(authors);
                response.setProductGenres(genres);
                response.setProductPublisher(publisher);
                response.setProductSeries(series);
                response.setCoverImages(images);
                response.setDiscountPercent(discountPercent);

                return response;
        }

        @Override
        public Product getBySlug(String slug) {
                return productRepository.findBySlug(slug)
                                .orElseThrow(() -> new NotFoundException("Product not found slug " + slug));
        }

        @Override
        public ProductDetailResponse detail(String slug) {
                Product product = getBySlug(slug);
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
                Long shopId = shop.getId();
                validate(request);
                product.setSlug(generateUniqueSlug(shopId, TextUtils.toSlug(request.getName())));
                product.setShop(shop);
                product.setStatus(ProductStatus.PENDING_APPROVAL);
                Product saved = saveProduct(product, request, shopId);
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
        public PageResponse<SuperAdminProductResponse> searchProductsForAdmin(SuperAdminFilterRequest request) {
                Pageable pageable = PageRequest.of(
                                Math.max(0, Optional.ofNullable(request.getPage()).orElse(1) - 1),
                                Optional.ofNullable(request.getSize()).filter(s -> s > 0).orElse(10),
                                Sort.by(Sort.Direction.DESC, "id"));

                Page<SuperAdminProductProjection> page = productRepository.searchProductsForAdmin(
                                StringUtils.trimToNull(request.getKeyword()),
                                request.getStatus(),
                                request.getShopId(),
                                pageable);

                List<Long> productIds = page.stream()
                                .map(product -> product.getProductId())
                                .toList();

                Map<Long, String> imageMap = imageProductService.findThumbnailMap(productIds);

                List<SuperAdminProductResponse> responses = page.getContent()
                                .stream()
                                .map(product -> {
                                        SuperAdminProductResponse response = productMapper.toSuperAdmin(product);
                                        response.setUrlImageDefault(imageMap.get(product.getProductId()));
                                        return response;
                                })
                                .toList();

                return new PageResponse<>(
                                responses,
                                page.getNumber(),
                                page.getSize(),
                                page.getTotalElements(),
                                page.getTotalPages());
        }

        @Override
        public PageResponse<ProductResponse> searchProductsForShop(ShopProductFilterRequest request, Long shopId) {
                Pageable pageable = PageRequest.of(
                                Math.max(0, Optional.ofNullable(request.getPage()).orElse(1) - 1),
                                Optional.ofNullable(request.getSize()).filter(s -> s > 0).orElse(10),
                                Sort.by(Sort.Direction.DESC, "id"));

                Page<Product> page = productRepository.searchProductsByShopId(
                                StringUtils.trimToNull(request.getKeyword()),
                                request.getStatus(),
                                shopId,
                                pageable);

                List<Product> products = page.getContent();

                List<Long> productIds = products.stream()
                                .map(product -> product.getId())
                                .toList();

                Map<Long, List<String>> authorMap = authorProductService.findAuthorMap(productIds);
                Map<Long, List<String>> genreMap = genreProductService.findGenreMap(productIds);
                Map<Long, String> imageMap = imageProductService.findThumbnailMap(productIds);
                List<ProductResponse> responses = products.stream()
                                .map(product -> {
                                        ProductResponse dto = productMapper.toDTO(product);
                                        Long productId = product.getId();
                                        dto.setAuthorsName(authorMap.getOrDefault(productId, List.of()));
                                        dto.setGenresName(genreMap.getOrDefault(productId, List.of()));
                                        dto.setUrlImageDefault(imageMap.get(productId));
                                        dto.setShop(new ShopSimpleResponse(
                                                        product.getShop().getId(),
                                                        product.getShop().getName(),
                                                        product.getShop().getSlug()));
                                        return dto;
                                })
                                .toList();

                return new PageResponse<>(
                                responses,
                                page.getNumber(),
                                page.getSize(),
                                page.getTotalElements(),
                                page.getTotalPages());
        }

        @Override
        @Transactional
        public void approve(Long id) {
                Product product = getById(id);
                if (product.getStatus() != ProductStatus.PENDING_APPROVAL) {
                        throw new BadRequestException("Chỉ có thể duyệt sản phẩm đang ở trạng thái chờ duyệt.");
                }
                product.setStatus(ProductStatus.ACTIVE);
        }

        @Override
        public void reject(Long id, String reasons) {
                Product product = getById(id);
                if (product.getStatus() != ProductStatus.PENDING_APPROVAL) {
                        throw new BadRequestException("Chỉ có thể tử chối sản phẩm đang ở trạng thái chờ duyệt.");
                }
                product.setReason(reasons);
                product.setStatus(ProductStatus.REJECTED);
                productRepository.save(product);
        }

        @Override
        @Transactional(readOnly = true)
        public Map<Long, ShopSimpleResponse> findShopMap(List<Long> productIds) {
                return productRepository.findByIdIn(productIds)
                                .stream()
                                .collect(Collectors.toMap(
                                                product -> product.getId(),
                                                product -> new ShopSimpleResponse(
                                                                product.getShop().getId(),
                                                                product.getShop().getName(),
                                                                product.getShop().getSlug())));
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
                String oldSlug = product.getSlug();

                productMapper.toEntity(product, request);

                product.setSlug(
                                Objects.equals(oldName, product.getName())
                                                ? oldSlug
                                                : generateUniqueSlug(shopId, product.getSlug()));
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

        @Override
        public PageResponse<ProductCardResponse> filterProductsForUser(UserFilterRequest request, Long userId) {
                Pageable pageable = PageRequest.of(
                                Math.max(0, Optional.ofNullable(request.getPage()).orElse(1) - 1),
                                Optional.ofNullable(request.getSize()).filter(s -> s > 0).orElse(10),
                                Sort.by(Sort.Direction.DESC, "id"));

                Page<ProductCardResponse> page = productRepositoryImpl.searchProductsForUser(request, userId, pageable);

                return new PageResponse<>(
                                page.getContent(),
                                page.getNumber(),
                                page.getSize(),
                                page.getTotalElements(),
                                page.getTotalPages());
        }

}
