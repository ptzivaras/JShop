package com.ptprojects.eshopapi.service;

import com.ptprojects.eshopapi.domain.OrderStatus;
import com.ptprojects.eshopapi.dtos.OrderResponse;

import java.util.List;

public interface OrderService {

    List<OrderResponse> getAllOrders();

    OrderResponse getOrderById(Long id);

    List<OrderResponse> getOrdersByUserId(Long userId);

    OrderResponse createOrder(Long userId);

    OrderResponse updateOrderStatus(Long id, OrderStatus status);
}
