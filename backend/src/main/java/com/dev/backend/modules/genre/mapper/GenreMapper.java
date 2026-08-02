package com.dev.backend.modules.genre.mapper;

import com.dev.backend.common.utils.TextUtils;
import com.dev.backend.modules.genre.dto.GenreRequest;
import com.dev.backend.modules.genre.dto.GenreResponse;
import com.dev.backend.modules.genre.entity.Genre;
import org.springframework.stereotype.Component;

@Component
public class GenreMapper {

    public Genre toEntity(Genre genre, GenreRequest request) {
        if (genre == null || request == null) {
            return null;
        }
        genre.setName(TextUtils.capitalizeFully(request.getName()));
        genre.setSlug(TextUtils.toSlug(request.getName()));
        genre.setStatus(request.getStatus());
        return genre;
    }

    public GenreResponse toDTO(Genre entity) {
        if (entity == null) {
            return null;
        }
        GenreResponse dto = new GenreResponse();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setSlug(entity.getSlug());
        dto.setStatus(entity.getStatus());
        return dto;

    }

}
