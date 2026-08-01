package com.dev.backend.modules.author_product.service.impl;

import com.dev.backend.modules.author_product.entity.AuthorProduct;
import com.dev.backend.modules.author_product.repository.AuthorProductRepository;
import com.dev.backend.modules.author_product.service.AuthorProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthorProductServiceImpl implements AuthorProductService {

    private final AuthorProductRepository authorProductRepository;

    @Override
    @Transactional(readOnly = true)
    public List<AuthorProduct> getAllAuthorProducts() {
        return authorProductRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public AuthorProduct getAuthorProductById(Long id) {
        return authorProductRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("AuthorProduct not found with id: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<AuthorProduct> getAuthorProductsByProductId(Long productId) {
        return authorProductRepository.findByProductId(productId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AuthorProduct> getAuthorProductsByAuthorId(Long authorId) {
        return authorProductRepository.findByAuthorId(authorId);
    }

    @Override
    public AuthorProduct createAuthorProduct(AuthorProduct authorProduct) {
        return authorProductRepository.save(authorProduct);
    }

    @Override
    public void deleteAuthorProduct(Long id) {
        if (!authorProductRepository.existsById(id)) {
            throw new RuntimeException("AuthorProduct not found with id: " + id);
        }
        authorProductRepository.deleteById(id);
    }
}
