package com.dev.backend.modules.googlebook.dto;

import java.util.List;

import lombok.Data;

@Data
public class GoogleBookApiResponse {
    private int totalItems;
    private List<BookItem> items;

    @Data
    public static class BookItem {
        private String id;
        private VolumeInfo volumeInfo;
        private SaleInfo saleInfo;
    }

    @Data
    public static class VolumeInfo {
        private String title;
        private List<String> authors;
        private String publishedDate;
        private Integer pageCount;
        private String language;
        private String description;
        private List<IndustryIdentifiers> industryIdentifiers;
        private ImageLinks imageLinks;
    }

    @Data
    public static class IndustryIdentifiers {
        private String type;
        private String identifier;
    }

    @Data
    public static class SaleInfo {
        private ListPrice listPrice;
        private RetailPrice retailPrice;
    }

    @Data
    public static class ListPrice {
        private Double amount;
        private String currencyCode;
    }

    @Data
    public static class RetailPrice {
        private Double amount;
        private String currencyCode;
    }

    @Data
    public static class ImageLinks {
        private String thumbnail;

    }
}