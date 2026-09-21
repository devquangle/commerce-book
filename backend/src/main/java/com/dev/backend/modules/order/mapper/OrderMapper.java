package com.dev.backend.modules.order.mapper;

import com.dev.backend.modules.order.dto.OrderItemRequest;
import com.dev.backend.modules.order.dto.OrderItemResponse;
import com.dev.backend.modules.order.dto.OrderRequest;
import com.dev.backend.modules.order.dto.OrderResponse;
import com.dev.backend.modules.order.entity.Order;
import com.dev.backend.modules.order.entity.OrderItem;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.stream.Collectors;

@Component
public class OrderMapper {

    public Order toEntity(OrderRequest request) {
        if (request == null) {
            return null;
        }
        Order order = new Order();
        order.setOrderCode(request.getOrderCode());
        order.setTotalAmount(request.getTotalAmount());
        order.setShippingFee(request.getShippingFee());
        order.setStatus(request.getStatus());
        order.setShippingAddress(request.getShippingAddress());
        order.setPaymentMethod(request.getPaymentMethod());
        order.setPaymentStatus(request.getPaymentStatus());
        order.setVoucher(request.getVoucher());
        order.setVoucherAmount(request.getVoucherAmount());
        return order;
    }

    public OrderResponse toResponse(Order entity) {
        if (entity == null) {
            return null;
        }
        return OrderResponse.builder()
                .id(entity.getId())
                .orderCode(entity.getOrderCode())
                .userId(entity.getUser() != null ? entity.getUser().getId() : null)
                .shopId(entity.getShop() != null ? entity.getShop().getId() : null)
                .totalAmount(entity.getTotalAmount())
                .shippingFee(entity.getShippingFee())
                .status(entity.getStatus())
                .shippingAddress(entity.getShippingAddress())
                .paymentMethod(entity.getPaymentMethod())
                .paymentStatus(entity.getPaymentStatus())
                .voucher(entity.getVoucher())
                .voucherAmount(entity.getVoucherAmount())
                .orderItems(entity.getOrderItems() != null ? entity.getOrderItems().stream()
                        .map(this::toOrderItemResponse)
                        .collect(Collectors.toList()) : Collections.emptyList())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    public OrderItem toOrderItemEntity(OrderItemRequest request) {
        if (request == null) {
            return null;
        }
        OrderItem orderItem = new OrderItem();
        orderItem.setPrice(request.getPrice());
        orderItem.setQuantity(request.getQuantity());
        orderItem.setProductSnap(request.getProductSnap());
        return orderItem;
    }

    public OrderItemResponse toOrderItemResponse(OrderItem entity) {
        if (entity == null) {
            return null;
        }
        return OrderItemResponse.builder()
                .id(entity.getId())
                .orderId(entity.getOrder() != null ? entity.getOrder().getId() : null)
                .productId(entity.getProduct() != null ? entity.getProduct().getId() : null)
                .price(entity.getPrice())
                .quantity(entity.getQuantity())
                .productSnap(entity.getProductSnap())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    public void updateEntityFromRequest(OrderRequest request, Order entity) {
        if (request == null || entity == null) {
            return;
        }
        if (request.getOrderCode() != null) {
            entity.setOrderCode(request.getOrderCode());
        }
        if (request.getTotalAmount() != null) {
            entity.setTotalAmount(request.getTotalAmount());
        }
        if (request.getShippingFee() != null) {
            entity.setShippingFee(request.getShippingFee());
        }
        if (request.getStatus() != null) {
            entity.setStatus(request.getStatus());
        }
        if (request.getShippingAddress() != null) {
            entity.setShippingAddress(request.getShippingAddress());
        }
        if (request.getPaymentMethod() != null) {
            entity.setPaymentMethod(request.getPaymentMethod());
        }
        if (request.getPaymentStatus() != null) {
            entity.setPaymentStatus(request.getPaymentStatus());
        }
        if (request.getVoucher() != null) {
            entity.setVoucher(request.getVoucher());
        }
        if (request.getVoucherAmount() != null) {
            entity.setVoucherAmount(request.getVoucherAmount());
        }
    }
}
