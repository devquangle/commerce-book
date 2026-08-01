package com.dev.backend.modules.order.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItemResponse {
    private Long id;
    private Long orderId;
    private Long productId;
    private BigDecimal price;
    private Integer quantity;
    private String productSnap;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
