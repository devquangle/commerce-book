package com.dev.backend.modules.author.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AuthorFilterRequest {
    private String keyword;
    private String status;
    private Integer page;
    private Integer size;
}