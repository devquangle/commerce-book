package com.dev.backend.modules.googlebook.service;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import com.dev.backend.modules.googlebook.dto.GoogleBookApiResponse;
import com.dev.backend.modules.googlebook.dto.GoogleBookResponse;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class GoogleBookServiceImpl implements GoogleBookService {

    private final RestTemplate restTemplate;

    private static final String GOOGLE_BOOK_API = "https://www.googleapis.com/books/v1/volumes";

    @Value("${app.google.books.api-key}")
    private String googleBooksApiKey;

    @Override
    public List<GoogleBookResponse> searchBooks(String query) {
        log.info("Searching Google Books for title: {}", query);

        try {
            String url = UriComponentsBuilder.fromUriString(GOOGLE_BOOK_API)
                    .queryParam("q", query.trim())
                    .queryParam("printType", "books")
                    .queryParam("maxResults", 40)
                    .queryParam("orderBy", "relevance")
                    .queryParam(
                            "fields",
                            "totalItems,items(" +
                                    "id," +
                                    "volumeInfo(" +
                                    "title," +
                                    "authors," +
                                    "publishedDate," +
                                    "pageCount," +
                                    "language," +
                                    "description," +
                                    "industryIdentifiers(type,identifier)," +
                                    "imageLinks(thumbnail)" +
                                    ")," +
                                    "saleInfo(" +
                                    "listPrice(amount,currencyCode)," +
                                    "retailPrice(amount,currencyCode)" +
                                    ")" +
                                    ")")
                    .queryParam("key", googleBooksApiKey)
                    .build()
                    .toUriString();

            log.debug("Request URL: {}", url);

            GoogleBookApiResponse apiResponse = restTemplate.getForObject(
                    url,
                    GoogleBookApiResponse.class);

            if (apiResponse == null
                    || apiResponse.getItems() == null
                    || apiResponse.getItems().isEmpty()) {

                log.warn("No books found for query: {}", query);
                return Collections.emptyList();
            }

            return apiResponse.getItems()
                    .stream()
                    .filter(item -> item.getVolumeInfo() != null)
                    .map(this::convertToResponse)
                    .collect(Collectors.toList());

        } catch (Exception e) {
            log.error("Error calling Google Books API for query: {}", query, e);
            throw new RuntimeException("Failed to fetch Google Books API", e);
        }
    }

    private GoogleBookResponse convertToResponse(GoogleBookApiResponse.BookItem item) {

        GoogleBookResponse response = new GoogleBookResponse();
        response.setVolumeId(item.getId());

        GoogleBookApiResponse.VolumeInfo volumeInfo = item.getVolumeInfo();

        if (volumeInfo != null) {
            response.setName(volumeInfo.getTitle());
            response.setAuthors(volumeInfo.getAuthors());
            response.setPublishedDate(volumeInfo.getPublishedDate());
            response.setDescription(
                    volumeInfo.getDescription() != null
                            ? volumeInfo.getDescription()
                            : "Hiện chưa có mô tả cho cuốn sách này.");
            response.setPageCount(volumeInfo.getPageCount());
            response.setLanguage(
                    volumeInfo.getLanguage() != null
                            ? volumeInfo.getLanguage()
                            : "vi");

            if (volumeInfo.getImageLinks() != null) {
                response.setThumbnail(volumeInfo.getImageLinks().getThumbnail());
            }

            response.setIsbn(extractIsbn(volumeInfo));
        }

        if (item.getSaleInfo() != null) {

            GoogleBookApiResponse.SaleInfo saleInfo = item.getSaleInfo();

            if (saleInfo.getListPrice() != null) {
                response.setListPrice(saleInfo.getListPrice().getAmount());
            }

            if (saleInfo.getRetailPrice() != null) {
                response.setRetailPrice(saleInfo.getRetailPrice().getAmount());
            }
        }

        return response;
    }

    private String extractIsbn(GoogleBookApiResponse.VolumeInfo volumeInfo) {

        if (volumeInfo.getIndustryIdentifiers() == null) {
            return null;
        }

        return volumeInfo.getIndustryIdentifiers()
                .stream()
                .filter(i -> "ISBN_13".equals(i.getType()))
                .map(GoogleBookApiResponse.IndustryIdentifiers::getIdentifier)
                .findFirst()
                .orElse(
                        volumeInfo.getIndustryIdentifiers()
                                .stream()
                                .filter(i -> "ISBN_10".equals(i.getType()))
                                .map(GoogleBookApiResponse.IndustryIdentifiers::getIdentifier)
                                .findFirst()
                                .orElse(null));
    }
}