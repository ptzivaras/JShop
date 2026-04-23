package com.ptprojects.eshopapi.controller;

import com.ptprojects.eshopapi.dtos.OrderResponse;
import com.ptprojects.eshopapi.dtos.UpdateOrderStatusRequest;
import com.ptprojects.eshopapi.repository.UserRepository;
import com.ptprojects.eshopapi.service.OrderService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;
    private final UserRepository userRepository;

    public OrderController(OrderService orderService,
                           UserRepository userRepository) {
        this.orderService = orderService;
        this.userRepository = userRepository;
    }

    private Long resolveCurrentUserId(Authentication authentication) {
        String username = authentication.getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found with username: " + username))
                .getId();
    }

    private void ensureOwnResource(Long requestedUserId, Authentication authentication) {
        Long currentUserId = resolveCurrentUserId(authentication);
        if (!currentUserId.equals(requestedUserId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only access your own orders");
        }
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<OrderResponse>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OrderResponse> getOrderById(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrderById(id));
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<List<OrderResponse>> getOrdersByUserId(@PathVariable Long userId,
                                                                 Authentication authentication) {
        ensureOwnResource(userId, authentication);
        return ResponseEntity.ok(orderService.getOrdersByUserId(userId));
    }

    @PostMapping("/user/{userId}")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<OrderResponse> createOrder(@PathVariable Long userId,
                                                     Authentication authentication) {
        ensureOwnResource(userId, authentication);
        return ResponseEntity.status(HttpStatus.CREATED).body(orderService.createOrder(userId));
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<List<OrderResponse>> getMyOrders(Authentication authentication) {
        Long currentUserId = resolveCurrentUserId(authentication);
        return ResponseEntity.ok(orderService.getOrdersByUserId(currentUserId));
    }

    @PostMapping("/me")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<OrderResponse> createMyOrder(Authentication authentication) {
        Long currentUserId = resolveCurrentUserId(authentication);
        return ResponseEntity.status(HttpStatus.CREATED).body(orderService.createOrder(currentUserId));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OrderResponse> updateOrderStatus(@PathVariable Long id,
                                                           @RequestBody UpdateOrderStatusRequest request) {
        return ResponseEntity.ok(orderService.updateOrderStatus(id, request.getStatus()));
    }
}
