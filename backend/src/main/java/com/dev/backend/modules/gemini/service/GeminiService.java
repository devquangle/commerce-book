package com.dev.backend.modules.gemini.service;

import com.dev.backend.modules.gemini.dto.BookMetaResponse;
import com.dev.backend.modules.gemini.dto.BookMetaRequest;

public interface GeminiService {
    BookMetaResponse generateBookMeta(BookMetaRequest request);

}
