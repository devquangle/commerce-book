package com.dev.backend.modules.order.service;

import com.dev.backend.modules.order.dto.OrderRequest;
import com.dev.backend.modules.order.dto.OrderResponse;

import java.util.List;

public interface OrderService {
    List<OrderResponse> getAllOrders();
    OrderResponse getOrderById(Long id);
    List<OrderResponse> getOrdersByUserId(Long userId);
    List<OrderResponse> getOrdersByShopId(Long shopId);
    OrderResponse createOrder(OrderRequest request);
    OrderResponse updateOrder(Long id, OrderRequest request);
    void deleteOrder(Long id);
}
