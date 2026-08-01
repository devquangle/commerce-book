package com.dev.backend.modules.genre.service.impl;

import com.dev.backend.modules.genre.dto.GenreRequest;
import com.dev.backend.modules.genre.dto.GenreResponse;
import com.dev.backend.modules.genre.entity.Genre;
import com.dev.backend.modules.genre.mapper.GenreMapper;
import com.dev.backend.modules.genre.repository.GenreRepository;
import com.dev.backend.modules.genre.service.GenreService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class GenreServiceImpl implements GenreService {

    private final GenreRepository genreRepository;
    private final GenreMapper genreMapper;

    @Override
    @Transactional(readOnly = true)
    public List<GenreResponse> getAllGenres() {
        return genreRepository.findAll().stream()
                .map(genreMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public GenreResponse getGenreById(Long id) {
        Genre genre = genreRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Genre not found with id: " + id));
        return genreMapper.toResponse(genre);
    }

    @Override
    public GenreResponse createGenre(GenreRequest request) {
        Genre genre = genreMapper.toEntity(request);
        Genre savedGenre = genreRepository.save(genre);
        return genreMapper.toResponse(savedGenre);
    }

    @Override
    public GenreResponse updateGenre(Long id, GenreRequest request) {
        Genre genre = genreRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Genre not found with id: " + id));
        genreMapper.updateEntityFromRequest(request, genre);
        Genre updatedGenre = genreRepository.save(genre);
        return genreMapper.toResponse(updatedGenre);
    }

    @Override
    public void deleteGenre(Long id) {
        if (!genreRepository.existsById(id)) {
            throw new RuntimeException("Genre not found with id: " + id);
        }
        genreRepository.deleteById(id);
    }
}
