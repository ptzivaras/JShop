package com.ptprojects.eshopapi.controller;

import com.ptprojects.eshopapi.dtos.AddToCartRequest;
import com.ptprojects.eshopapi.dtos.ShoppingCartResponse;
import com.ptprojects.eshopapi.repository.UserRepository;
import com.ptprojects.eshopapi.service.ShoppingCartService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/cart")
public class ShoppingCartController {

    private final ShoppingCartService shoppingCartService;
    private final UserRepository userRepository;

    public ShoppingCartController(ShoppingCartService shoppingCartService,
                                  UserRepository userRepository) {
        this.shoppingCartService = shoppingCartService;
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
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only access your own cart");
        }
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<ShoppingCartResponse> getMyCart(Authentication authentication) {
        Long currentUserId = resolveCurrentUserId(authentication);
        return ResponseEntity.ok(shoppingCartService.getCartByUserId(currentUserId));
    }

    @PostMapping("/me/items")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<ShoppingCartResponse> addItemToMyCart(
            Authentication authentication,
            @RequestBody AddToCartRequest request) {
        Long currentUserId = resolveCurrentUserId(authentication);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(shoppingCartService.addItemToCart(currentUserId, request));
    }

    @DeleteMapping("/me/items/{itemId}")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<Void> removeItemFromMyCart(
            Authentication authentication,
            @PathVariable Long itemId) {
        Long currentUserId = resolveCurrentUserId(authentication);
        shoppingCartService.removeItemFromCart(currentUserId, itemId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{userId}")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<ShoppingCartResponse> getCart(@PathVariable Long userId,
                                                        Authentication authentication) {
        ensureOwnResource(userId, authentication);
        return ResponseEntity.ok(shoppingCartService.getCartByUserId(userId));
    }

    @PostMapping("/{userId}/items")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<ShoppingCartResponse> addItemToCart(
            @PathVariable Long userId,
            Authentication authentication,
            @RequestBody AddToCartRequest request) {
        ensureOwnResource(userId, authentication);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(shoppingCartService.addItemToCart(userId, request));
    }

    @DeleteMapping("/{userId}/items/{itemId}")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<Void> removeItemFromCart(
            @PathVariable Long userId,
            Authentication authentication,
            @PathVariable Long itemId) {
        ensureOwnResource(userId, authentication);
        shoppingCartService.removeItemFromCart(userId, itemId);
        return ResponseEntity.noContent().build();
    }
}
