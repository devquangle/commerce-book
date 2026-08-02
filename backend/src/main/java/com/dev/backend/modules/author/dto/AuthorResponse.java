package com.dev.backend.modules.author.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

import com.dev.backend.common.enums.AuthorStatus;

@Data
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
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
