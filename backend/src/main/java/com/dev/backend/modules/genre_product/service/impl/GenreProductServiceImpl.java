package com.dev.backend.modules.genre_product.service.impl;

import com.dev.backend.modules.genre_product.entity.GenreProduct;
import com.dev.backend.modules.genre_product.repository.GenreProductRepository;
import com.dev.backend.modules.genre_product.service.GenreProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class GenreProductServiceImpl implements GenreProductService {

    private final GenreProductRepository genreProductRepository;

    @Override
    @Transactional(readOnly = true)
    public List<GenreProduct> getAllGenreProducts() {
        return genreProductRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public GenreProduct getGenreProductById(Long id) {
        return genreProductRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("GenreProduct not found with id: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<GenreProduct> getGenreProductsByProductId(Long productId) {
        return genreProductRepository.findByProductId(productId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<GenreProduct> getGenreProductsByGenreId(Long genreId) {
        return genreProductRepository.findByGenreId(genreId);
    }

    @Override
    public GenreProduct createGenreProduct(GenreProduct genreProduct) {
        return genreProductRepository.save(genreProduct);
    }

    @Override
    public void deleteGenreProduct(Long id) {
        if (!genreProductRepository.existsById(id)) {
            throw new RuntimeException("GenreProduct not found with id: " + id);
        }
        genreProductRepository.deleteById(id);
    }
}
