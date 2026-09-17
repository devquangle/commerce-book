package com.dev.backend.modules.others.banks.service;

import java.util.List;

import com.dev.backend.modules.others.banks.dto.BankResponse;

public interface  APIBankService {
    List<BankResponse> banks();
}
