package com.dev.backend.modules.author.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthorRequest {
    private String name;
    private String slug;
    private String wikibaseItem;
    private String urlImage;
    private String urlBio;
    private String description;
    private String status;
}
