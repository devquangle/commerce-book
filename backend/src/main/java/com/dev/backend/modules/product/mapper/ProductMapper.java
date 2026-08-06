package com.dev.backend.modules.product.mapper;

import com.dev.backend.common.utils.TextUtils;
import com.dev.backend.modules.product.dto.ProductDetailResponse;
import com.dev.backend.modules.product.dto.ProductRequest;
import com.dev.backend.modules.product.dto.ProductResponse;
import com.dev.backend.modules.product.entity.Product;
import org.springframework.stereotype.Component;

@Component
public class ProductMapper {

    public Product toEntity(Product product, ProductRequest request) {
        if (request == null) {
            return null;
        }
        product.setName(TextUtils.capitalizeFully(request.getName().strip()));
        product.setOriginalPrice(request.getOriginalPrice());
        product.setPrice(request.getPrice());
        product.setQuantity(request.getQuantity());
        product.setWeight(request.getWeight());
        product.setPublishYear(request.getPublishYear());
        product.setPages(request.getPages());
        product.setLanguage(request.getLanguage());
        product.setIsbn(request.getIsbn());
        product.setStatus(request.getStatus());
        product.setDescription(request.getDescription());
        return product;
    }

    public ProductResponse toDTO(Product entity) {
        if (entity == null) {
            return null;
        }
        ProductResponse response = new ProductResponse();

        response.setProductId(entity.getId().intValue());
        response.setName(entity.getName());
        response.setSlug(entity.getSlug());
        response.setOriginalPrice(entity.getOriginalPrice());
        response.setPrice(entity.getPrice());
        response.setQuantity(entity.getQuantity());
        response.setWeight(entity.getWeight());
        response.setPublishYear(
                entity.getPublishYear() != null
                        ? entity.getPublishYear().toString()
                        : null);
        response.setPages(entity.getPages());
        response.setLanguage(entity.getLanguage());
        response.setIsbn(entity.getIsbn());

        response.setPublisherName(
                entity.getPublisher() != null
                        ? entity.getPublisher().getName()
                        : null);

        response.setSeriesName(
                entity.getSeries() != null
                        ? entity.getSeries().getName()
                        : null);
        response.setReason(entity.getReason());
        // response.setGenresName(
        // genreProductService.getGenreNamesByProductId(entity.getId()));

        // response.setAuthorsName(
        // authorProductService.getAuthorNamesByProductId(entity.getId()));

        // response.setUrlImageDefault(
        // imageProductService.getDefaultImageUrlByProductId(entity.getId()));

        response.setStatus(entity.getStatus());

        return response;

    }

    // public ProductInfo toDTO(Product entity) {
    // if (entity == null) {
    // return null;
    // }
    // ProductInfo response = new ProductInfo();

    // return response;
    // }

    public ProductDetailResponse toDetailDTO(Product entity) {
        if (entity == null) {
            return null;
        }
        ProductDetailResponse response = new ProductDetailResponse();
        response.setProductId(entity.getId());
        response.setName(entity.getName());
        response.setSlug(entity.getSlug());
        response.setOriginalPrice(entity.getOriginalPrice());
        response.setPrice(entity.getPrice());
        response.setQuantity(entity.getQuantity());
        response.setWeight(entity.getWeight());
        response.setPublishYear(
                entity.getPublishYear() != null
                        ? entity.getPublishYear().toString()
                        : null);
        response.setPages(entity.getPages());
        response.setLanguage(entity.getLanguage());
        response.setIsbn(entity.getIsbn());
        response.setDescription(entity.getDescription());

        response.setPublisherId(
                entity.getPublisher() != null
                        ? entity.getPublisher().getId()
                        : null);

        response.setSeriesId(
                entity.getSeries() != null
                        ? entity.getSeries().getId()
                        : null);
      response.setStatus(entity.getStatus());
         response.setReason(entity.getReason());
        return response;
    }
}
