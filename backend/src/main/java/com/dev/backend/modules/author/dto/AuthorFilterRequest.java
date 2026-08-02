package com.dev.backend.modules.author.dto;

import com.dev.backend.common.enums.AuthorStatus;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AuthorFilterRequest {
    private String keyword;
    private AuthorStatus status;
    private Integer page;
    private Integer size;
}