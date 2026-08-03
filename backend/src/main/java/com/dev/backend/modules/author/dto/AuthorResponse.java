package com.dev.backend.modules.author.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import com.dev.backend.common.enums.AuthorStatus;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AuthorResponse {
    private Long id;
    private String name;
    private String slug;
    private String wikibaseItem;
    private String urlImage;
    private String urlBio;
    private String description;
    private AuthorStatus status;
}
