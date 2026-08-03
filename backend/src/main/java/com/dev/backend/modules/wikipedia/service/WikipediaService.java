package com.dev.backend.modules.wikipedia.service;

import com.dev.backend.modules.wikipedia.dto.WikipediaResponse;

public interface WikipediaService {

    WikipediaResponse fetchApiInforAuthor(String name);

    boolean checkWikidataClaims(String qid);
}