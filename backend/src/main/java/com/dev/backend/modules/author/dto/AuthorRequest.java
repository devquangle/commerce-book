package com.dev.backend.modules.author.dto;

import com.dev.backend.common.enums.AuthorStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AuthorRequest {
    private String name;
    private String wikibaseItem;
    private String urlImage;
    private String urlBio;
    private String extract;
    private AuthorStatus status;
}
