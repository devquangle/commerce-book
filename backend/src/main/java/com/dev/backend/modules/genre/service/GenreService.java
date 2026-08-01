package com.dev.backend.modules.genre.service;

import com.dev.backend.modules.genre.dto.GenreRequest;
import com.dev.backend.modules.genre.dto.GenreResponse;

import java.util.List;

public interface GenreService {
    List<GenreResponse> getAllGenres();
    GenreResponse getGenreById(Long id);
    GenreResponse createGenre(GenreRequest request);
    GenreResponse updateGenre(Long id, GenreRequest request);
    void deleteGenre(Long id);
}
