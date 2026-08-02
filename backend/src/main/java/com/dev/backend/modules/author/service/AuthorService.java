package com.dev.backend.modules.author.service;

import com.dev.backend.common.response.PageResponse;
import com.dev.backend.modules.author.dto.AuthorFilterRequest;
import com.dev.backend.modules.author.dto.AuthorRequest;
import com.dev.backend.modules.author.dto.AuthorResponse;

import java.util.List;

public interface AuthorService {
    List<AuthorResponse> getAllAuthors();

    AuthorResponse getById(Long id);

    AuthorResponse create(AuthorRequest request);

    AuthorResponse update(Long id, AuthorRequest request);

    void deleteAuthor(Long id);

    void insertData();

    PageResponse<AuthorResponse> search(AuthorFilterRequest request);
}
