package com.dev.backend.modules.genre_product.service;

import com.dev.backend.modules.genre_product.repository.GenreProductRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class GenreProductServiceImpl implements GenreProductService {
    private static final String OTHER = "Khác";
    private static final String UNKNOWN = "Chưa có thông thể loại";
    private final GenreProductRepository genreProductRepository;

    @Override
    public List<String> getGenreNamesByProductId(Long productId) {

        return genreProductRepository.findGenreNamesByProductId(productId)
                .stream()
                .map(name -> OTHER.equals(name) ? UNKNOWN : name)
                .toList();
    }
}
