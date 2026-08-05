package com.dev.backend.modules.author_product.service;

import com.dev.backend.modules.author.entity.Author;
import com.dev.backend.modules.author_product.entity.AuthorProduct;
import com.dev.backend.modules.author_product.repository.AuthorProductRepository;
import com.dev.backend.modules.product.entity.Product;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthorProductServiceImpl implements AuthorProductService {
    private static final String OTHER = "Khác";
    private static final String UNKNOWN = "Chưa có thông tin tác giả";
    private final AuthorProductRepository authorProductRepository;

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    @Transactional(readOnly = true)
    public List<String> getAuthorNamesByProductId(Long productId) {
        return authorProductRepository.findAuthorNamesByProductId(productId)
                .stream()
                .map(name -> OTHER.equals(name) ? UNKNOWN : name)
                .toList();
    }
    @Override
    public List<Long> getAuthorIdsByProductId(Long productId) {
        return authorProductRepository.findAuthorIdsByProductId(productId);
    }

    @Override
    @Transactional
    public void setAuthorsProduct(Product product, List<Long> authorIds) {
        authorProductRepository.deleteByProductId(product.getId());
        if (authorIds == null || authorIds.isEmpty()) {
            return;
        }

        List<AuthorProduct> items = new ArrayList<>();
        List<Long> uniqueIds = authorIds.stream()
                .distinct()
                .toList();
        for (Long id : uniqueIds) {
            AuthorProduct entity = new AuthorProduct();
            entity.setProduct(product);
            Author authorProxy = entityManager.getReference(Author.class, id);
            entity.setAuthor(authorProxy);
            items.add(entity);
        }
        authorProductRepository.saveAll(items);

    }
}
