package com.dev.backend.modules.genre.service;

import com.dev.backend.common.response.PageResponse;
import com.dev.backend.modules.genre.dto.GenreFilterRequest;
import com.dev.backend.modules.genre.dto.GenreRequest;
import com.dev.backend.modules.genre.dto.GenreResponse;
import com.dev.backend.modules.genre.entity.Genre;

import java.util.List;

public interface GenreService {
    List<GenreResponse> getAllGenres();

    Genre getById(Long id);

    boolean existsByName(String name);

    void validate(GenreRequest request);


    GenreResponse create(GenreRequest request);

    GenreResponse update(Long id, GenreRequest request);

    void delete(Long id);

    void insertData();

    PageResponse<GenreResponse> search(GenreFilterRequest request);

}
