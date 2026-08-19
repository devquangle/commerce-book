package com.dev.backend.modules.promotion.service;

import com.dev.backend.common.response.PageResponse;
import com.dev.backend.modules.promotion.dto.PromotionFilterRequest;
import com.dev.backend.modules.promotion.dto.PromotionRequest;
import com.dev.backend.modules.promotion.dto.PromotionResponse;

public interface PromotionService {
  void insertData();

  PageResponse<PromotionResponse> filterPromotions(PromotionFilterRequest request, Long shopId);

  void delete(Long id, Long shopId);

  PromotionResponse create(PromotionRequest request, Long shopId);
  PromotionResponse detail(Long id, Long shopId);
}
