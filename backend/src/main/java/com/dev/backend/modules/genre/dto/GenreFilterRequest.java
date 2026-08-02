package com.dev.backend.modules.genre.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GenreFilterRequest {
    private String keyword;
    private String status;
    private Integer page;
    private Integer size;
}
