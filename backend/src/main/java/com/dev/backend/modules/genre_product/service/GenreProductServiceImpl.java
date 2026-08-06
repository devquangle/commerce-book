package com.dev.backend.modules.genre_product.service;

import com.dev.backend.modules.genre.entity.Genre;
import com.dev.backend.modules.genre_product.entity.GenreProduct;
import com.dev.backend.modules.genre_product.repository.GenreProductRepository;
import com.dev.backend.modules.product.entity.Product;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class GenreProductServiceImpl implements GenreProductService {
    private final GenreProductRepository genreProductRepository;
    @PersistenceContext
    private EntityManager entityManager;

    @Override
    @Transactional(readOnly = true)
    public List<String> getGenreNamesByProductId(Long productId) {

        return genreProductRepository.findGenreNamesByProductId(productId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Long> getGenreIdsByProductId(Long productId) {
        return genreProductRepository.findGenreIdsByProductId(productId);
    }

    @Override
    public Map<Long, List<String>> findGenreMap(List<Long> productIds) {
       return genreProductRepository.findByProductIdIn(productIds)
            .stream()
            .collect(Collectors.groupingBy(
                    item -> item.getProduct().getId(),
                    Collectors.mapping(
                            item -> item.getGenre().getName(),
                            Collectors.toList()
                    )
            ));
    }

    @Override
    @Transactional
    public void setGenresProduct(Product product, List<Long> genreIds) {
        genreProductRepository.deleteByProductId(product.getId());
        if (genreIds == null || genreIds.isEmpty()) {
            return;
        }

        List<GenreProduct> items = new ArrayList<>();
        List<Long> uniqueIds = genreIds.stream()
                .distinct()
                .toList();
        for (Long genreId : uniqueIds) {
            GenreProduct entity = new GenreProduct();
            entity.setProduct(product);
            Genre genreProxy = entityManager.getReference(Genre.class, genreId);
            entity.setGenre(genreProxy);
            items.add(entity);
        }
        genreProductRepository.saveAll(items);

    }
}
