package com.dev.backend.modules.search_api.service;

import com.dev.backend.modules.search_api.dto.UrlImageResponse;

public interface SearchApiService {
    UrlImageResponse getTop5ImageLinks(String keyword);

}
