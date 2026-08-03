package com.dev.backend.modules.search_api.dto;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.Data;




@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class SearchApiResponse {
    private List<ImageWrapper> images;

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class ImageWrapper {
        private OriginalData original;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class OriginalData {
        private String link;
    }

}
