package com.dev.backend.modules.gemini.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class AuthorsBookMetaResponse {
    private String name;
    private String bio;
}
