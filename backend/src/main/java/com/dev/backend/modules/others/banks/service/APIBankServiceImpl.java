package com.dev.backend.modules.others.banks.service;

import java.util.List;

import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.dev.backend.common.response.BankDataResponse;
import com.dev.backend.modules.others.banks.dto.APIBankResponse;
import com.dev.backend.modules.others.banks.dto.BankResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class APIBankServiceImpl implements APIBankService {

    private static final String BANK_API_URL =
            "https://api.vietqr.io/v2/banks";

    private final RestTemplate restTemplate;

    @Override
    public List<BankResponse> banks() {

        ResponseEntity<BankDataResponse<APIBankResponse>> response =
                restTemplate.exchange(
                        BANK_API_URL,
                        HttpMethod.GET,
                        null,
                        new ParameterizedTypeReference<BankDataResponse<APIBankResponse>>() {}
                );

        BankDataResponse<APIBankResponse> body = response.getBody();

        if (body == null || body.getData() == null) {
            return List.of();
        }

        return body.getData()
                .stream()
                .map(bank -> new BankResponse(
                        bank.id(),
                        bank.name(),
                        bank.shortName()
                ))
                .toList();
    }
}