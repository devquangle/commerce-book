package com.dev.backend.modules.wikipedia.dto;


import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class WikipediaApiResponse {
    private String type;
    private String title;
    private String extract;

    @JsonProperty("wikibase_item")
    private String wikibaseItem;

    private String description;

    private Thumbnail thumbnail;

    @JsonProperty("content_urls")
    private ContentUrls contentUrls;

    @JsonProperty("titles")
    private Titles titles;

    @Data
    public static class Thumbnail {
        private String source;
    }

    @Data
    public static class ContentUrls {
        private Desktop desktop;
    }

    @Data
    public static class Titles {
        private String canonical;
    }

    @Data
    public static class Desktop {
        private String page;
    }

}
