package com.ptprojects.eshopapi.controller;

import com.ptprojects.eshopapi.dtos.WishlistItemResponse;
import com.ptprojects.eshopapi.repository.UserRepository;
import com.ptprojects.eshopapi.service.WishlistService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {

    private final WishlistService wishlistService;
    private final UserRepository userRepository;

    public WishlistController(WishlistService wishlistService, UserRepository userRepository) {
        this.wishlistService = wishlistService;
        this.userRepository = userRepository;
    }

    private Long resolveCurrentUserId(Authentication authentication) {
        String username = authentication.getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found with username: " + username))
                .getId();
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<List<WishlistItemResponse>> getMyWishlist(Authentication authentication) {
        Long userId = resolveCurrentUserId(authentication);
        return ResponseEntity.ok(wishlistService.getWishlistForUser(userId));
    }

    @PostMapping("/me/{productId}")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<WishlistItemResponse> addToWishlist(@PathVariable Long productId,
                                                              Authentication authentication) {
        Long userId = resolveCurrentUserId(authentication);
        return ResponseEntity.ok(wishlistService.addProductToWishlist(userId, productId));
    }

    @DeleteMapping("/me/{productId}")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<Void> removeFromWishlist(@PathVariable Long productId,
                                                   Authentication authentication) {
        Long userId = resolveCurrentUserId(authentication);
        wishlistService.removeProductFromWishlist(userId, productId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/me/{productId}/exists")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<Boolean> isProductInWishlist(@PathVariable Long productId,
                                                        Authentication authentication) {
        Long userId = resolveCurrentUserId(authentication);
        return ResponseEntity.ok(wishlistService.isProductInWishlist(userId, productId));
    }
}
