package com.dev.backend.modules.search_api.dto;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class SearchApiImage {

        private Integer position;

        private String title;

        private String link;

        private String source;

        private String thumbnail;

        private SearchApiOriginal original;
}