package com.dev.backend.modules.others.viettel.service;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import com.dev.backend.config.viettel.ViettelAiConfig;
import com.dev.backend.modules.others.viettel.dto.EkycResponse;
import com.dev.backend.modules.others.viettel.dto.FaceVerificationResponse;
import com.dev.backend.modules.others.viettel.dto.InformationResponse;

import lombok.RequiredArgsConstructor;

/**
 * ViettelIdCheckServiceImpl
 */
@Service
@RequiredArgsConstructor
public class ViettelIdCheckServiceImpl implements ViettelIdCheckService {

    private final RestTemplate restTemplate;
    private final ViettelAiConfig viettelAiConfig;

    @Override
    public FaceVerificationResponse executeFaceVerify(
            MultipartFile imageCmt,
            MultipartFile imageLive,
            Double refScore) {
        try {
            String apiUrl = viettelAiConfig.getUrl() + "/ekyc/face_matching";
            String token = viettelAiConfig.getToken();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            MultiValueMap<String, Object> requestBody = new LinkedMultiValueMap<>();

            requestBody.add("image_cmt", imageCmt.getResource());
            requestBody.add("image_live", imageLive.getResource());
            requestBody.add("ref_score", refScore);
            requestBody.add("token", token);

            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(requestBody, headers);

            ResponseEntity<FaceVerificationResponse> response = restTemplate.exchange(
                    apiUrl,
                    HttpMethod.POST,
                    requestEntity,
                    FaceVerificationResponse.class);

            return response.getBody();

        } catch (Exception e) {
            throw new RuntimeException("Face verification failed", e);
        }
    }

    @Override
    public InformationResponse executeOcrIdCard(
            MultipartFile imageFront,
            MultipartFile imageBack) {
        try {
            String apiUrl = viettelAiConfig.getUrl() + "/ekyc/id_card";
            String token = viettelAiConfig.getToken();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            MultiValueMap<String, Object> requestBody = new LinkedMultiValueMap<>();

            requestBody.add("image_front", imageFront.getResource());
            requestBody.add("image_back", imageBack.getResource());
            requestBody.add("token", token);

            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(requestBody, headers);

            ResponseEntity<InformationResponse> response = restTemplate.exchange(
                    apiUrl,
                    HttpMethod.POST,
                    requestEntity,
                    InformationResponse.class);

            return response.getBody();

        } catch (Exception e) {
            throw new RuntimeException("OCR ID card failed", e);
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

        } catch (Exception e) {
            throw new RuntimeException("eKYC verification failed", e);
        }
    }

}