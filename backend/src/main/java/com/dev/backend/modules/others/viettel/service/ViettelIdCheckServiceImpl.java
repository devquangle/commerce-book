package com.dev.backend.modules.others.viettel.service;

import java.io.IOException;

import java.nio.charset.StandardCharsets;

import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import com.dev.backend.common.exception.AppException;
import com.dev.backend.config.viettel.ViettelAiConfig;
import com.dev.backend.modules.others.viettel.dto.EkycResponse;
import com.dev.backend.modules.others.viettel.dto.FaceVerificationResponse;
import com.dev.backend.modules.others.viettel.dto.InformationResponse;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * ViettelIdCheckServiceImpl
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ViettelIdCheckServiceImpl implements ViettelIdCheckService {

    private final RestTemplate restTemplate;
    private final ViettelAiConfig viettelAiConfig;
    private final ObjectMapper objectMapper;

    @Override
    public FaceVerificationResponse executeFaceVerify(
            MultipartFile imageCmt,
            MultipartFile imageLive,
            Double refScore) {
        try {
            String apiUrl = viettelAiConfig.getUrl() + "/ekyc/face_matching";
            String token = viettelAiConfig.getToken();

            log.info("Calling Viettel Face Matching API: {}", apiUrl);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            MultiValueMap<String, Object> requestBody = new LinkedMultiValueMap<>();
            requestBody.add("image_cmt", toByteArrayResource(imageCmt));
            requestBody.add("image_live", toByteArrayResource(imageLive));
            requestBody.add("ref_score", refScore != null ? refScore : 0.9);
            requestBody.add("token", token);

            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(requestBody, headers);

            ResponseEntity<byte[]> response = restTemplate.exchange(
                    apiUrl,
                    HttpMethod.POST,
                    requestEntity,
                    byte[].class);

            byte[] bodyBytes = response.getBody();
            if (bodyBytes == null || bodyBytes.length == 0) {
                throw new AppException(HttpStatus.BAD_GATEWAY.value(), "Không nhận được phản hồi từ dịch vụ xác thực khuôn mặt");
            }

            String responseBody = new String(bodyBytes, StandardCharsets.UTF_8);
            log.info("Viettel Face Matching raw response: {}", responseBody);

            JsonNode rootNode = objectMapper.readTree(responseBody);
            int code = rootNode.has("code") ? rootNode.get("code").asInt() : 1;
            if (code != 1 && code != 200) {
                String errMsg = rootNode.has("vi_message") ? rootNode.get("vi_message").asText()
                        : (rootNode.has("message") ? rootNode.get("message").asText() : "Xác thực khuôn mặt thất bại");
                throw new AppException(HttpStatus.BAD_REQUEST.value(), "Lỗi xác thực khuôn mặt: " + errMsg);
            }

            return objectMapper.treeToValue(rootNode, FaceVerificationResponse.class);

        } catch (AppException e) {
            throw e;
        } catch (Exception e) {
            log.error("Face verification failed", e);
            throw new AppException(HttpStatus.BAD_REQUEST.value(), "Face verification failed: " + e.getMessage());
        }
    }

    @Override
    public InformationResponse executeOcrIdCard(
            MultipartFile imageFront,
            MultipartFile imageBack) {
        try {
            String apiUrl = viettelAiConfig.getUrl() + "/ekyc/id_card";
            String token = viettelAiConfig.getToken();

            log.info("Calling Viettel OCR API: {}", apiUrl);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            MultiValueMap<String, Object> requestBody = new LinkedMultiValueMap<>();
            requestBody.add("image_front", toByteArrayResource(imageFront));
            requestBody.add("image_back", toByteArrayResource(imageBack));
            requestBody.add("token", token);

            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(requestBody, headers);

            ResponseEntity<byte[]> response = restTemplate.exchange(
                    apiUrl,
                    HttpMethod.POST,
                    requestEntity,
                    byte[].class);

            byte[] bodyBytes = response.getBody();
            if (bodyBytes == null || bodyBytes.length == 0) {
                throw new AppException(HttpStatus.BAD_GATEWAY.value(), "Không nhận được phản hồi từ dịch vụ Viettel AI OCR");
            }

            String responseBody = new String(bodyBytes, StandardCharsets.UTF_8);
            log.info("Viettel OCR API raw response: {}", responseBody);

            JsonNode rootNode = objectMapper.readTree(responseBody);
            int code = rootNode.has("code") ? rootNode.get("code").asInt() : 1;
            String message = rootNode.has("vi_message") ? rootNode.get("vi_message").asText()
                    : (rootNode.has("message") ? rootNode.get("message").asText() : "");

            if (code != 1 && code != 200) {
                log.warn("Viettel OCR returned code {}: {}", code, message);
                throw new AppException(HttpStatus.BAD_REQUEST.value(), "Lỗi nhận diện CCCD: " + message);
            }

            JsonNode infoNode = null;
            if (rootNode.has("information") && !rootNode.get("information").isNull()) {
                infoNode = rootNode.get("information");
            } else if (rootNode.has("data") && !rootNode.get("data").isNull()) {
                JsonNode dataNode = rootNode.get("data");
                if (dataNode.isArray() && !dataNode.isEmpty()) {
                    infoNode = dataNode.get(0);
                } else {
                    infoNode = dataNode;
                }
            } else {
                infoNode = rootNode;
            }

            InformationResponse information = objectMapper.treeToValue(infoNode, InformationResponse.class);

            if (information == null || (information.getId() == null && information.getName() == null)) {
                log.warn("Viettel OCR information has null id and name: {}", responseBody);
                throw new AppException(HttpStatus.BAD_REQUEST.value(), "Không thể nhận diện được thông tin từ ảnh CCCD. Vui lòng kiểm tra lại ảnh chụp rõ nét hơn.");
            }

            return information;

        } catch (AppException e) {
            throw e;
        } catch (Exception e) {
            log.error("OCR ID card failed", e);
            throw new AppException(HttpStatus.BAD_REQUEST.value(), "OCR ID card failed: " + e.getMessage());
        }
    }


    @Override
    public EkycResponse executeEkyc(
            MultipartFile imageFront,
            MultipartFile imageBack,
            MultipartFile imageSelfie,
            Double refScore) {
        try {
            // 1. OCR + verify CCCD
            InformationResponse information = executeOcrIdCard(imageFront, imageBack);

            // 2. Face verification
            FaceVerificationResponse verification = executeFaceVerify(imageFront, imageSelfie, refScore);

            // 3. Combine result
            EkycResponse response = new EkycResponse();
            response.setCode("200");
            response.setMessage("eKYC verification successful");
            response.setInformation(information);
            response.setVerification(verification);

            return response;

        } catch (AppException e) {
            throw e;
        } catch (Exception e) {
            log.error("eKYC verification failed", e);
            throw new AppException(HttpStatus.BAD_REQUEST.value(), "eKYC verification failed: " + e.getMessage());
        }
    }

    private ByteArrayResource toByteArrayResource(MultipartFile file) throws IOException {
        return new ByteArrayResource(file.getBytes()) {
            @Override
            public String getFilename() {
                return file.getOriginalFilename() != null ? file.getOriginalFilename() : "image.jpg";
            }
        };
    }

}