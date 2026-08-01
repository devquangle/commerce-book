package com.dev.backend.modules.order.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderResponse {
    private Long id;
    private String orderCode;
    private Long userId;
    private Long shopId;
    private BigDecimal totalAmount;
    private BigDecimal shippingFee;
    private String status;
    private String shippingAddress;
    private String paymentMethod;
    private String paymentStatus;
    private String voucher;
    private BigDecimal voucherAmount;
    private List<OrderItemResponse> orderItems;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
