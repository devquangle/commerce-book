package com.dev.backend.modules.author.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class WikipediaResponse {

    private String name;
    private String wikibaseItem;
    private String urlImage;
    private String urlBio;
    private String extract;
}