package com.dev.backend.modules.genre.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

import com.dev.backend.common.enums.GenreStatus;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class GenreResponse {
    private Long id;
    private String name;
    private String description;
    private String slug;
    private GenreStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
