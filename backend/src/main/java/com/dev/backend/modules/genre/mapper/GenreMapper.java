package com.dev.backend.modules.genre.mapper;

import com.dev.backend.modules.genre.dto.GenreRequest;
import com.dev.backend.modules.genre.dto.GenreResponse;
import com.dev.backend.modules.genre.entity.Genre;
import org.springframework.stereotype.Component;

@Component
public class GenreMapper {

    public Genre toEntity(GenreRequest request) {
        if (request == null) {
            return null;
        }
        return Genre.builder()
                .name(request.getName())
                .description(request.getDescription())
                .slug(request.getSlug())
                .build();
    }

    public GenreResponse toResponse(Genre entity) {
        if (entity == null) {
            return null;
        }
        return GenreResponse.builder()
                .id(entity.getId())
                .name(entity.getName())
                .description(entity.getDescription())
                .slug(entity.getSlug())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    public void updateEntityFromRequest(GenreRequest request, Genre entity) {
        if (request == null || entity == null) {
            return;
        }
        if (request.getName() != null) {
            entity.setName(request.getName());
        }
        if (request.getDescription() != null) {
            entity.setDescription(request.getDescription());
        }
        if (request.getSlug() != null) {
            entity.setSlug(request.getSlug());
        }
    }
}
