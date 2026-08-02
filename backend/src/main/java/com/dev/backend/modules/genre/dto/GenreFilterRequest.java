package com.dev.backend.modules.genre.dto;

import com.dev.backend.common.enums.GenreStatus;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GenreFilterRequest {
    private String keyword;
    private GenreStatus status;
    private Integer page;
    private Integer size;
}
