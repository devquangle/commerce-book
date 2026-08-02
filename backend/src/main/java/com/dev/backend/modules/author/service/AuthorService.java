package com.dev.backend.modules.author.service;

import com.dev.backend.common.response.PageResponse;
import com.dev.backend.modules.author.dto.AuthorFilterRequest;
import com.dev.backend.modules.author.dto.AuthorRequest;
import com.dev.backend.modules.author.dto.AuthorResponse;
import com.dev.backend.modules.author.entity.Author;

import java.util.List;

public interface AuthorService {
    List<AuthorResponse> getAllAuthors();

    boolean existsByName(String name);

    void validate(AuthorRequest request);

    Author getById(Long id);

    AuthorResponse detail(Long id);

    AuthorResponse create(AuthorRequest request);

    AuthorResponse update(Long id, AuthorRequest request);

    void delete(Long id);

    void insertData();

    PageResponse<AuthorResponse> search(AuthorFilterRequest request);
}
