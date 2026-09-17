package com.dev.backend.modules.others.banks.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dev.backend.common.response.ResponseData;
import com.dev.backend.common.response.ResponseUtil;
import com.dev.backend.modules.others.banks.dto.BankResponse;
import com.dev.backend.modules.others.banks.service.APIBankService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class BankController {
    private final APIBankService bankService;

    @GetMapping("/banks")
    public ResponseEntity<ResponseData<List<BankResponse>>> getBanks() {
        List<BankResponse> provinceDTOs = bankService.banks();
        return ResponseUtil.success("Lấy danh sách ngân hàng thành công", provinceDTOs);
    }

}
