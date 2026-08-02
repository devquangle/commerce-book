package com.dev.backend.modules.author.service;

import com.dev.backend.modules.author.dto.WikipediaResponse;

public interface WikipediaService {

    WikipediaResponse fetchApiInforAuthor(String name);

    boolean checkWikidataClaims(String qid);
}