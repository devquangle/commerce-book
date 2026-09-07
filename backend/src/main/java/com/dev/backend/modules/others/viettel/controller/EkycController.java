package com.dev.backend.modules.others.viettel.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.dev.backend.common.response.ResponseData;
import com.dev.backend.common.response.ResponseUtil;
import com.dev.backend.modules.others.viettel.dto.EkycRequest;
import com.dev.backend.modules.others.viettel.dto.EkycResponse;
import com.dev.backend.modules.others.viettel.service.ViettelIdCheckService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/ekyc")
public class EkycController {
    private final ViettelIdCheckService viettelIdCheckService;

    @PostMapping("/verify")
    public ResponseEntity<ResponseData<EkycResponse>> verify(
        @ModelAttribute  EkycRequest request
    ) {
        EkycResponse ekycResponse= viettelIdCheckService.executeEkyc(request.getImageFront(), request.getImageBack(), request.getImageSelfie(), 0.9);
        return ResponseUtil.success("Xác thực thành công", ekycResponse);
    }
}
