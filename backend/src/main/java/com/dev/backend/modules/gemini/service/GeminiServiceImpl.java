package com.dev.backend.modules.gemini.service;

import org.springframework.stereotype.Service;


import com.dev.backend.modules.gemini.dto.BookMetaResponse;
import com.dev.backend.modules.gemini.dto.BookMetaRequest;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class GeminiServiceImpl implements GeminiService {

    private final Client client;
    private static final String MODEL_ID = "gemini-3.1-flash-lite";

    @Override
    public BookMetaResponse generateBookMeta(BookMetaRequest request) {

        log.info("BookMetaRequest: name={}, authors={}",
                request.getName(),
                String.join(", ", request.getAuthors()));

        String authors = String.join(", ", request.getAuthors());
        String bookName = request.getName();
        // Yêu cầu trả về tiếng Việt và đúng định dạng
        String prompt = """
                Hãy phân tích cuốn sách tiêu đề "%s" của tác giả %s.
                Yêu cầu nội dung:
                1. mainSummary: Tóm tắt nội dung chính (10-15 câu).
                2. highlights: 3-5 điểm nổi bật (dạng danh sách).
                3. artisticValue: 3-5 giá trị nghệ thuật (dạng danh sách).
                4. targetAudience: 3 nhóm độc giả mục tiêu (dạng danh sách).
                5. authorsBookMetas: Tên tác giả và tiểu sử/chuyên môn (tối đa 10 câu) cho mỗi người.

                QUY ĐỊNH BẮT BUỘC:
                - Trả về JSON thuần túy, không kèm giải thích.
                - Phải sử dụng đúng tên các key: "mainSummary", "highlights", "artisticValue", "targetAudience", "authorsBookMetas".
                - Trong "authorsBookMetas", sử dụng key là "name" và "bio".
                - Nội dung phải bằng TIẾNG VIỆT.
                """
                .formatted(bookName, authors);

        try {
            GenerateContentResponse response = client.models.generateContent(MODEL_ID, prompt, null);

            String jsonText = response.text()
                    .replaceAll("(?s).*?(\\{.*\\}).*", "$1") // Cố gắng lấy phần JSON nếu có rác xung quanh
                    .replaceAll("```json", "")
                    .replaceAll("```", "")
                    .trim();

            ObjectMapper mapper = new ObjectMapper();
            return mapper.readValue(jsonText, BookMetaResponse.class);

        } catch (Exception e) {
            log.error("Error generateBookMeta ", e);
            return null;
        }
    }
}
