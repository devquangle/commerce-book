package com.dev.backend.modules.gemini.dto;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BookMetaRequest {
    private String name;
    private List<String> authors;
}
