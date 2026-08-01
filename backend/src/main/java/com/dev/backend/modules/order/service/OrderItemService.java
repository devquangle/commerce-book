package com.dev.backend.modules.order.service;

import com.dev.backend.modules.order.dto.OrderItemRequest;
import com.dev.backend.modules.order.dto.OrderItemResponse;

import java.util.List;

public interface OrderItemService {
    List<OrderItemResponse> getOrderItemsByOrderId(Long orderId);
    OrderItemResponse getOrderItemById(Long id);
    OrderItemResponse createOrderItem(OrderItemRequest request);
    void deleteOrderItem(Long id);
}
