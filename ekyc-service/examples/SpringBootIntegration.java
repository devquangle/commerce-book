package com.example.ekyc.integration;

import org.springframework.core.io.FileSystemResource;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Map;

/**
 * Ví dụ Spring Boot gọi eKYC Service qua RestTemplate.
 *
 * <p>Yêu cầu dependency trong pom.xml:
 * <pre>
 *   &lt;dependency&gt;
 *     &lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;
 *     &lt;artifactId&gt;spring-boot-starter-web&lt;/artifactId&gt;
 *   &lt;/dependency&gt;
 * </pre>
 *
 * <p>Hoặc với WebClient (reactive):
 * <pre>
 *   &lt;dependency&gt;
 *     &lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;
 *     &lt;artifactId&gt;spring-boot-starter-webflux&lt;/artifactId&gt;
 *   &lt;/dependency&gt;
 * </pre>
 */
@Service
public class EkycIntegrationService {

    /** URL của eKYC Python service */
    private static final String EKYC_SERVICE_URL = "http://localhost:8000/verify";

    private final RestTemplate restTemplate;

    public EkycIntegrationService() {
        this.restTemplate = new RestTemplate();
    }

    // =========================================================================
    // RESPONSE DTO
    // =========================================================================

    /**
     * DTO khớp với JSON response từ eKYC service.
     */
    public static class EkycResponse {
        private boolean success;
        private String message;
        private Boolean verified;
        private Double similarity;
        private double threshold;
        private OcrResult ocr;

        // Getters & Setters
        public boolean isSuccess()             { return success; }
        public void setSuccess(boolean s)      { this.success = s; }
        public String getMessage()             { return message; }
        public void setMessage(String m)       { this.message = m; }
        public Boolean getVerified()           { return verified; }
        public void setVerified(Boolean v)     { this.verified = v; }
        public Double getSimilarity()          { return similarity; }
        public void setSimilarity(Double s)    { this.similarity = s; }
        public double getThreshold()           { return threshold; }
        public void setThreshold(double t)     { this.threshold = t; }
        public OcrResult getOcr()              { return ocr; }
        public void setOcr(OcrResult o)        { this.ocr = o; }

        @Override
        public String toString() {
            return String.format(
                "EkycResponse{success=%b, verified=%b, similarity=%.4f, message='%s'}",
                success, verified, similarity, message
            );
        }
    }

    /**
     * DTO cho thông tin OCR trích xuất từ CCCD.
     */
    public static class OcrResult {
        private String identityNumber;
        private String fullName;
        private String dateOfBirth;
        private String gender;
        private String nationality;
        private String placeOfOrigin;
        private String placeOfResidence;
        private String issueDate;

        // Getters & Setters
        public String getIdentityNumber()                { return identityNumber; }
        public void setIdentityNumber(String id)         { this.identityNumber = id; }
        public String getFullName()                      { return fullName; }
        public void setFullName(String n)                { this.fullName = n; }
        public String getDateOfBirth()                   { return dateOfBirth; }
        public void setDateOfBirth(String d)             { this.dateOfBirth = d; }
        public String getGender()                        { return gender; }
        public void setGender(String g)                  { this.gender = g; }
        public String getNationality()                   { return nationality; }
        public void setNationality(String n)             { this.nationality = n; }
        public String getPlaceOfOrigin()                 { return placeOfOrigin; }
        public void setPlaceOfOrigin(String p)           { this.placeOfOrigin = p; }
        public String getPlaceOfResidence()              { return placeOfResidence; }
        public void setPlaceOfResidence(String p)        { this.placeOfResidence = p; }
        public String getIssueDate()                     { return issueDate; }
        public void setIssueDate(String d)               { this.issueDate = d; }
    }

    // =========================================================================
    // METHOD 1: Gọi từ MultipartFile (Spring MVC Controller)
    // =========================================================================

    /**
     * Gọi eKYC service từ Controller nhận MultipartFile.
     *
     * <p>Dùng trong Spring MVC Controller:
     * <pre>
     *   {@literal @}PostMapping("/ekyc")
     *   public ResponseEntity<?> verifyEkyc(
     *       {@literal @}RequestParam MultipartFile idCard,
     *       {@literal @}RequestParam MultipartFile selfie
     *   ) {
     *       EkycResponse result = ekycService.verifyFromMultipart(idCard, selfie);
     *       return ResponseEntity.ok(result);
     *   }
     * </pre>
     *
     * @param idCard  MultipartFile ảnh CCCD
     * @param selfie  MultipartFile ảnh selfie
     * @return EkycResponse kết quả xác minh
     * @throws IOException Nếu không thể đọc file
     */
    public EkycResponse verifyFromMultipart(
            MultipartFile idCard,
            MultipartFile selfie
    ) throws IOException {
        // Tạo HttpHeaders với Content-Type multipart/form-data
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        // Tạo multipart body
        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();

        // Thêm file idCard vào body
        body.add("idCard", createFileResource(idCard, "idcard.jpg"));

        // Thêm file selfie vào body
        body.add("selfie", createFileResource(selfie, "selfie.jpg"));

        HttpEntity<MultiValueMap<String, Object>> requestEntity =
                new HttpEntity<>(body, headers);

        try {
            ResponseEntity<EkycResponse> response = restTemplate.postForEntity(
                    EKYC_SERVICE_URL,
                    requestEntity,
                    EkycResponse.class
            );

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                return response.getBody();
            }

            // Fallback nếu response null
            EkycResponse errorResponse = new EkycResponse();
            errorResponse.setSuccess(false);
            errorResponse.setMessage("Empty response from eKYC service");
            return errorResponse;

        } catch (HttpClientErrorException e) {
            // Lỗi 4xx từ eKYC service
            EkycResponse errorResponse = new EkycResponse();
            errorResponse.setSuccess(false);
            errorResponse.setMessage("eKYC service error: " + e.getMessage());
            return errorResponse;
        }
    }

    // =========================================================================
    // METHOD 2: Gọi từ đường dẫn file
    // =========================================================================

    /**
     * Gọi eKYC service với đường dẫn file trên disk.
     *
     * @param idCardPath  Đường dẫn ảnh CCCD
     * @param selfiePath  Đường dẫn ảnh selfie
     * @return EkycResponse kết quả xác minh
     */
    public EkycResponse verifyFromFilePaths(String idCardPath, String selfiePath) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("idCard", new FileSystemResource(new File(idCardPath)));
        body.add("selfie", new FileSystemResource(new File(selfiePath)));

        HttpEntity<MultiValueMap<String, Object>> requestEntity =
                new HttpEntity<>(body, headers);

        ResponseEntity<EkycResponse> response = restTemplate.postForEntity(
                EKYC_SERVICE_URL,
                requestEntity,
                EkycResponse.class
        );

        return response.getBody();
    }

    // =========================================================================
    // METHOD 3: Health Check
    // =========================================================================

    /**
     * Kiểm tra trạng thái eKYC service.
     *
     * @return true nếu service đang chạy
     */
    public boolean isServiceHealthy() {
        try {
            ResponseEntity<Map> response = restTemplate.getForEntity(
                    "http://localhost:8000/health",
                    Map.class
            );
            return response.getStatusCode().is2xxSuccessful();
        } catch (Exception e) {
            return false;
        }
    }

    // =========================================================================
    // PRIVATE HELPERS
    // =========================================================================

    /**
     * Chuyển MultipartFile thành ByteArrayResource với filename (để RestTemplate gửi đúng).
     */
    private org.springframework.core.io.ByteArrayResource createFileResource(
            MultipartFile file,
            String filename
    ) throws IOException {
        byte[] bytes = file.getBytes();
        return new org.springframework.core.io.ByteArrayResource(bytes) {
            @Override
            public String getFilename() {
                // Giữ tên file gốc nếu có, dùng filename làm fallback
                String original = file.getOriginalFilename();
                return (original != null && !original.isEmpty()) ? original : filename;
            }
        };
    }
}


// =============================================================================
// VÍ DỤ SỬ DỤNG TRONG CONTROLLER
// =============================================================================

/*

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/ekyc")
public class EkycController {

    @Autowired
    private EkycIntegrationService ekycIntegrationService;

    @PostMapping("/verify")
    public ResponseEntity<?> verify(
            @RequestParam("idCard") MultipartFile idCard,
            @RequestParam("selfie") MultipartFile selfie
    ) {
        try {
            EkycIntegrationService.EkycResponse result =
                ekycIntegrationService.verifyFromMultipart(idCard, selfie);

            if (result.isSuccess() && Boolean.TRUE.equals(result.getVerified())) {
                return ResponseEntity.ok(result);
            } else {
                return ResponseEntity.status(422).body(result);
            }

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body("eKYC processing failed: " + e.getMessage());
        }
    }

    @GetMapping("/health")
    public ResponseEntity<?> health() {
        boolean healthy = ekycIntegrationService.isServiceHealthy();
        return healthy
            ? ResponseEntity.ok("eKYC service is healthy")
            : ResponseEntity.status(503).body("eKYC service unavailable");
    }
}

*/
