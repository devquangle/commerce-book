package com.dev.backend.modules.search_api.service;

import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import com.dev.backend.modules.search_api.dto.SearchApiImage;
import com.dev.backend.modules.search_api.dto.SearchApiOriginal;
import com.dev.backend.modules.search_api.dto.SearchApiResponse;
import com.dev.backend.modules.search_api.dto.UrlImageResponse;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class SearchApiServiceImpl implements SearchApiService {
    private final RestTemplate restTemplate;

    @Override
    public UrlImageResponse getTop5ImageLinks(String keyword) {

        String url = UriComponentsBuilder.fromUriString("https://www.searchapi.io/api/v1/search")
                .queryParam("engine", "google_images")
                .queryParam("q", keyword)
                .queryParam("gl", "vn")
                .queryParam("hl", "vi")
                .queryParam("api_key", "K77tHqsk2AkFMiZrrzBCtJbR")
                .build()
                .toUriString();

        try {
            SearchApiResponse response = restTemplate.getForObject(url, SearchApiResponse.class);

            List<String> links = Optional.ofNullable(response)
                    .map(SearchApiResponse::getImages)
                    .orElse(Collections.emptyList())
                    .stream()
                    .map(SearchApiImage::getOriginal)
                    .filter(Objects::nonNull)
                    .map(SearchApiOriginal::getLink)
                    .filter(StringUtils::hasText)
                    .limit(5)
                    .toList();

            return new UrlImageResponse(links);

        } catch (RestClientException e) {
            log.error("Lỗi khi gọi SearchAPI với keyword={}", keyword, e);
            return new UrlImageResponse(Collections.emptyList());
        }
    }
}
