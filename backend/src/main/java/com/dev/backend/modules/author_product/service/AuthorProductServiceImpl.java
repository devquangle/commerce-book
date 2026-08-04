package com.dev.backend.modules.author_product.service;

import com.dev.backend.modules.author_product.repository.AuthorProductRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthorProductServiceImpl implements AuthorProductService {
    private static final String OTHER = "Khác";
    private static final String UNKNOWN = "Chưa có thông tin tác giả";
    private final AuthorProductRepository authorProductRepository;

    @Override
    @Transactional(readOnly = true)
    public List<String> getAuthorNamesByProductId(Long productId) {
        return authorProductRepository.findAuthorNamesByProductId(productId)
                .stream()
                .map(name -> OTHER.equals(name) ? UNKNOWN : name)
                .toList();
    }
}
