package com.dev.backend.modules.others.viettel.service;

import org.springframework.web.multipart.MultipartFile;

import com.dev.backend.modules.others.viettel.dto.InformationResponse;
import com.dev.backend.modules.others.viettel.dto.EkycResponse;
import com.dev.backend.modules.others.viettel.dto.FaceVerificationResponse;

public interface ViettelIdCheckService {
    InformationResponse executeOcrIdCard(MultipartFile imageFront, MultipartFile imageBack);

    FaceVerificationResponse executeFaceVerify(MultipartFile imageCmt, MultipartFile imageLive, Double refScore);

    EkycResponse executeEkyc(
            MultipartFile imageFront,
            MultipartFile imageBack,
            MultipartFile imageSelfie,
            Double refScore);
}
