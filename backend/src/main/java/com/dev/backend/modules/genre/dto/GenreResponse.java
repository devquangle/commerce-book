package com.dev.backend.modules.genre.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GenreResponse {
    private Long id;
    private String name;
    private String description;
    private String slug;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
