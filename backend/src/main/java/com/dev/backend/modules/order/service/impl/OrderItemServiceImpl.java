package com.dev.backend.modules.order.service.impl;

import com.dev.backend.modules.order.dto.OrderItemRequest;
import com.dev.backend.modules.order.dto.OrderItemResponse;
import com.dev.backend.modules.order.entity.OrderItem;
import com.dev.backend.modules.order.mapper.OrderMapper;
import com.dev.backend.modules.order.repository.OrderItemRepository;
import com.dev.backend.modules.order.service.OrderItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderItemServiceImpl implements OrderItemService {

    private final OrderItemRepository orderItemRepository;
    private final OrderMapper orderMapper;

    @Override
    @Transactional(readOnly = true)
    public List<OrderItemResponse> getOrderItemsByOrderId(Long orderId) {
        return orderItemRepository.findByOrderId(orderId).stream()
                .map(orderMapper::toOrderItemResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public OrderItemResponse getOrderItemById(Long id) {
        OrderItem orderItem = orderItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("OrderItem not found with id: " + id));
        return orderMapper.toOrderItemResponse(orderItem);
    }

    @Override
    public OrderItemResponse createOrderItem(OrderItemRequest request) {
        OrderItem orderItem = orderMapper.toOrderItemEntity(request);
        OrderItem savedOrderItem = orderItemRepository.save(orderItem);
        return orderMapper.toOrderItemResponse(savedOrderItem);
    }

    @Override
    public void deleteOrderItem(Long id) {
        if (!orderItemRepository.existsById(id)) {
            throw new RuntimeException("OrderItem not found with id: " + id);
        }
        orderItemRepository.deleteById(id);
    }
}
