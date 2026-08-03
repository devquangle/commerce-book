package com.dev.backend.modules.gemini.dto;


import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class BookMetaResponse {
    // Nội dung chính (H2)
    private String mainSummary; // Đoạn văn 15 - 25 câu

    // Điểm nổi bật (H2 + Bullet list)
    private List<String> highlights;

    // Gía trị nghệ thuật
    private List<String> artisticValue;

    // Đối tượng độc giả (H2 + Bullet list)
    private List<String> targetAudience;

    private List<AuthorsBookMetaResponse> authorsBookMetas;

  

}
