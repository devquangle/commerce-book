package com.dev.backend.modules.search_api.dto;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class SearchApiResponse {

    private List<SearchApiImage> images;
}
