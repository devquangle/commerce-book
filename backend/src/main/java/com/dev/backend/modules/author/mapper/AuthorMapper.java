package com.dev.backend.modules.author.mapper;

import com.dev.backend.modules.author.dto.AuthorRequest;
import com.dev.backend.modules.author.dto.AuthorResponse;
import com.dev.backend.modules.author.entity.Author;
import org.springframework.stereotype.Component;

@Component
public class AuthorMapper {

    public Author toEntity(AuthorRequest request) {
        if (request == null) {
            return null;
        }
        return Author.builder()
                .name(request.getName())
                .slug(request.getSlug())
                .wikibaseItem(request.getWikibaseItem())
                .urlImage(request.getUrlImage())
                .urlBio(request.getUrlBio())
                .description(request.getDescription())
                .status(request.getStatus())
                .build();
    }

    public AuthorResponse toResponse(Author entity) {
        if (entity == null) {
            return null;
        }
        return AuthorResponse.builder()
                .id(entity.getId())
                .name(entity.getName())
                .slug(entity.getSlug())
                .wikibaseItem(entity.getWikibaseItem())
                .urlImage(entity.getUrlImage())
                .urlBio(entity.getUrlBio())
                .description(entity.getDescription())
                .status(entity.getStatus())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    public void updateEntityFromRequest(AuthorRequest request, Author entity) {
        if (request == null || entity == null) {
            return;
        }
        if (request.getName() != null) {
            entity.setName(request.getName());
        }
        if (request.getSlug() != null) {
            entity.setSlug(request.getSlug());
        }
        if (request.getWikibaseItem() != null) {
            entity.setWikibaseItem(request.getWikibaseItem());
        }
        if (request.getUrlImage() != null) {
            entity.setUrlImage(request.getUrlImage());
        }
        if (request.getUrlBio() != null) {
            entity.setUrlBio(request.getUrlBio());
        }
        if (request.getDescription() != null) {
            entity.setDescription(request.getDescription());
        }
        if (request.getStatus() != null) {
            entity.setStatus(request.getStatus());
        }
    }
}
