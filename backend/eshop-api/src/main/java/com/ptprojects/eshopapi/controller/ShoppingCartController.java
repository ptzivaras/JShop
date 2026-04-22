package com.ptprojects.eshopapi.controller;

import com.ptprojects.eshopapi.dtos.AddToCartRequest;
import com.ptprojects.eshopapi.dtos.ShoppingCartResponse;
import com.ptprojects.eshopapi.service.ShoppingCartService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
public class ShoppingCartController {

    private final ShoppingCartService shoppingCartService;

    public ShoppingCartController(ShoppingCartService shoppingCartService) {
        this.shoppingCartService = shoppingCartService;
    }

    @GetMapping("/{userId}")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<ShoppingCartResponse> getCart(@PathVariable Long userId) {
        return ResponseEntity.ok(shoppingCartService.getCartByUserId(userId));
    }

    @PostMapping("/{userId}/items")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<ShoppingCartResponse> addItemToCart(
            @PathVariable Long userId,
            @RequestBody AddToCartRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(shoppingCartService.addItemToCart(userId, request));
    }

    @DeleteMapping("/{userId}/items/{itemId}")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<Void> removeItemFromCart(
            @PathVariable Long userId,
            @PathVariable Long itemId) {
        shoppingCartService.removeItemFromCart(userId, itemId);
        return ResponseEntity.noContent().build();
    }
}
