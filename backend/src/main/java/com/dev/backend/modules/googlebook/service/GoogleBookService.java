package com.dev.backend.modules.googlebook.service;

import java.util.List;

import com.dev.backend.modules.googlebook.dto.GoogleBookResponse;

public interface GoogleBookService {
    List<GoogleBookResponse> searchBooks(String query);

}
