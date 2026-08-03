package com.dev.backend.modules.wikipedia.service;


import java.util.Set;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import com.dev.backend.common.exception.NotFoundException;
import com.dev.backend.modules.wikipedia.dto.WikipediaApiResponse;
import com.dev.backend.modules.wikipedia.dto.WikipediaResponse;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class WikipediaServiceImpl implements WikipediaService {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    // Danh mục nghề nghiệp QID chuẩn liên quan đến ngành Sách / Xuất bản (ĐÃ XÓA
    // Q5)
    private static final Set<String> BOOK_AUTHOR_QIDS = Set.of(
            "Q36180", "Q4853732", "Q49757", "Q6625963", "Q333634", "Q214917", "Q11774201",
            "Q715301", "Q2831", "Q1930187", "Q422960", "Q17457788", "Q1334054", "Q1607826",
            "Q1622272", "Q593644", "Q901", "Q268305", "Q496418");

    private static final String URL_WIKI_SEARCH = "https://%s.wikipedia.org/w/api.php?action=query&list=search&srsearch=%s&format=json&srlimit=1";
    private static final String URL_SUMMARY = "https://%s.wikipedia.org/api/rest_v1/page/summary/";
    private static final String USER_AGENT = "MyWikiApp/1.0 (email@gmail.com)";

    // 🌟 TỐI ƯU CACHE: Đặt Cache ở đầu luồng hàm chính để ăn cache toàn bộ kết quả
    // tìm kiếm, tăng tốc độ tối đa
    @Cacheable(value = "wikipediaAuthors", key = "#name", unless = "#result == null")
    public WikipediaResponse fetchApiInforAuthor(String name) {
        if (name == null || name.trim().isEmpty()) {
            return null;
        }

        String searchKeyword = name.trim();

        // Ưu tiên tìm kiếm trên Wikipedia tiếng Việt trước
        WikipediaResponse viResult = processWikiSearchAndSummary("vi", searchKeyword);
        if (viResult != null) {
            return viResult;
        }

        // Nếu tiếng Việt không có, chuyển sang quét bên tiếng Anh
        WikipediaResponse enResult = processWikiSearchAndSummary("en", searchKeyword);
        if (enResult != null) {
            return enResult;
        }

        throw new NotFoundException(
                "Không tìm thấy thông tin tác giả hợp lệ cho từ khóa '" + name + "' trên hệ thống Wikipedia.");
    }

    private WikipediaResponse processWikiSearchAndSummary(String lang, String keyword) {
        try {
            String searchUrl = String.format(URL_WIKI_SEARCH, lang, keyword);
            String searchResponse = callExternalApi(searchUrl);

            if (searchResponse == null)
                return null;

            JsonNode root = objectMapper.readTree(searchResponse);
            JsonNode searchNodes = root.path("query").path("search");

            if (searchNodes.isMissingNode() || !searchNodes.isArray() || searchNodes.isEmpty()) {
                return null;
            }
            String exactTitle = searchNodes.get(0).path("title").asText().replace(" ", "_");
            String summaryUrl = String.format(URL_SUMMARY, lang) + exactTitle;
            return callWikiSummary(summaryUrl);

        } catch (NotFoundException e) {
            // Ném thẳng NotFoundException lên trên, không để block catch(Exception) nuốt
            // mất
            throw e;
        } catch (Exception e) {
            log.error("Lỗi xử lý tra cứu Wikipedia ngữ cảnh [{}] cho từ khóa {}: {}", lang, keyword, e.getMessage());
            return null;
        }
    }

    private WikipediaResponse callWikiSummary(String url) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("User-Agent", USER_AGENT);
            headers.set(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE);
            HttpEntity<Void> entity = new HttpEntity<>(headers);

            ResponseEntity<WikipediaApiResponse> response = restTemplate.exchange(
                    url, HttpMethod.GET, entity, WikipediaApiResponse.class);

            WikipediaApiResponse api = response.getBody();
            if (api == null)
                return null;

            String prettyJson = objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(api);
            log.info("Thông tin bộ Summary API nhận được:\n{}", prettyJson);

            // 🌟 FIX LỖI 1: Chặn đứng hoàn toàn trang định hướng (Disambiguation) như "Trần
            // Minh Hiếu"
            if ("disambiguation".equalsIgnoreCase(api.getType())) {
                log.warn("Hệ thống bỏ qua URL {} vì đây là trang định hướng rác.", url);
                return null;
            }

            // Nếu không có mã Wikidata QID, không thể xác thực chuyên sâu -> Loại bỏ đối
            // tượng không rõ nguồn gốc
            if (api.getWikibaseItem() == null || api.getWikibaseItem().isEmpty()) {
                log.warn("Hệ thống bỏ qua URL {} vì thiếu mã định danh dữ liệu cấu trúc (WikibaseItem).", url);
                return null;
            }

            WikipediaResponse res = new WikipediaResponse();
            res.setName(api.getTitle());
            res.setExtract(api.getExtract());
            res.setWikibaseItem(api.getWikibaseItem());

            if (api.getThumbnail() != null) {
                res.setUrlImage(api.getThumbnail().getSource());
            }
            if (api.getContentUrls() != null && api.getContentUrls().getDesktop() != null) {
                res.setUrlBio(api.getContentUrls().getDesktop().getPage());
            }

            String qid = res.getWikibaseItem();
            if (!isAuthor(qid, api.getDescription(), api.getExtract())) {
                log.warn("Thực thể '{}' ({}) bị từ chối do không thuộc nhóm đối tượng hợp lệ.", res.getName(), qid);
                throw new NotFoundException("Thông tin tìm thấy trên Wikipedia không thuộc nhóm tác giả hợp lệ.");
            }

            return res;

        } catch (HttpClientErrorException.NotFound e) {
            return null;
        } catch (NotFoundException e) {
            throw e;
        } catch (Exception e) {
            log.error("Lỗi khi bóc tách Summary tại URL {}: {}", url, e.getMessage());
            return null;
        }
    }

    private boolean isAuthor(String qid, String description, String extract) {
        String textToCheck = ((description != null ? description : "") + " " + (extract != null ? extract : ""))
                .toLowerCase();

        if (textToCheck.contains("ca sĩ") || textToCheck.contains("rapper") ||
                textToCheck.contains("mc") || textToCheck.contains("diễn viên") ||
                textToCheck.contains("nhạc sĩ") || textToCheck.contains("cải lương") ||
                textToCheck.contains("singer") || textToCheck.contains("actor") ||
                textToCheck.contains("actress") || textToCheck.contains("musician")) {
            log.debug("Rejected non-author profession: {}", description);
            return false;
        }

        // ✅ Primary validation: Wikidata QID check (most reliable)
        if (checkWikidataClaims(qid)) {
            return true;
        }

        // 📝 Secondary validation: text-based check (only if Wikidata doesn't confirm)
        if (textToCheck.contains("tác giả") || textToCheck.contains("nhà văn") ||
                textToCheck.contains("tiểu thuyết") || textToCheck.contains("dịch giả") ||
                textToCheck.contains("biên soạn") || textToCheck.contains("nhà thơ") ||
                textToCheck.contains("author") || textToCheck.contains("writer") ||
                textToCheck.contains("novelist") || textToCheck.contains("poet")) {
            return true;
        }

        return false;
    }

    public boolean checkWikidataClaims(String qid) {
        try {
            String wikidataUrl = "https://www.wikidata.org/wiki/Special:EntityData/" + qid + ".json";
            String json = callExternalApi(wikidataUrl);
            if (json == null)
                return false;

            JsonNode rootNode = objectMapper.readTree(json);
            JsonNode claimsNode = rootNode.path("entities").path(qid).path("claims");

            if (claimsNode.isMissingNode())
                return false;

            String[] targetProperties = { "P106", "P31" };
            for (String property : targetProperties) {
                JsonNode propNode = claimsNode.path(property);
                if (propNode.isArray()) {
                    for (JsonNode statement : propNode) {
                        JsonNode idNode = statement.path("mainsnak")
                                .path("datavalue")
                                .path("value")
                                .path("id");

                        if (idNode.isTextual() && BOOK_AUTHOR_QIDS.contains(idNode.asText())) {
                            return true;
                        }
                    }
                }
            }
        } catch (Exception e) {
            log.error("Lỗi khi kết nối kiểm tra thuộc tính tại Wikidata cho mã QID {}: {}", qid, e.getMessage());
        }
        return false;
    }

    private String callExternalApi(String url) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("User-Agent", USER_AGENT);
            headers.set(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE + ";charset=UTF-8");
            HttpEntity<Void> entity = new HttpEntity<>(headers);

            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
            return response.getBody();
        } catch (Exception e) {
            return null;
        }
    }
}