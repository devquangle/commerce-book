package com.dev.backend.modules.search_api.service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import com.dev.backend.config.SearchApiProperties;
import com.dev.backend.modules.search_api.dto.SearchApiResponse;
import com.dev.backend.modules.search_api.dto.UrlImageResponse;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class SearchApiServiceImpl implements SearchApiService {

    private final RestTemplate restTemplate;
    private final SearchApiProperties properties;

    @Override
    public UrlImageResponse getTop5ImageLinks(String keyword) {
        String req = UriComponentsBuilder.fromUriString(properties.url())
                .queryParam("engine", "google_images")
                .queryParam("q", keyword)
                .queryParam("gl", "vn")
                .queryParam("hl", "vi")
                .queryParam("api_key", properties.apiKey())
                .build()
                .toUriString();

        try {
            SearchApiResponse response = restTemplate.getForObject(req, SearchApiResponse.class);

            if (response != null && response.getImages() != null) {
                List<String> links = response.getImages().stream()
                        .filter(img -> img.getOriginal() != null && img.getOriginal().getLink() != null)
                        .limit(5)
                        .map(img -> img.getOriginal().getLink())
                        .collect(Collectors.toList());

                return new UrlImageResponse(links);
            }
        } catch (Exception e) {
            log.error("Lỗi khi gọi API SearchAPI cho từ khóa {}: {}", keyword, e.getMessage());
        }

        return new UrlImageResponse(new ArrayList<>());
    }
}
