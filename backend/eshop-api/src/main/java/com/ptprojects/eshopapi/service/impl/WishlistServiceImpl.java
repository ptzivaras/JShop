package com.ptprojects.eshopapi.service.impl;

import com.ptprojects.eshopapi.domain.Product;
import com.ptprojects.eshopapi.domain.User;
import com.ptprojects.eshopapi.domain.WishlistItem;
import com.ptprojects.eshopapi.dtos.WishlistItemResponse;
import com.ptprojects.eshopapi.repository.ProductRepository;
import com.ptprojects.eshopapi.repository.UserRepository;
import com.ptprojects.eshopapi.repository.WishlistItemRepository;
import com.ptprojects.eshopapi.service.WishlistService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WishlistServiceImpl implements WishlistService {

    private final WishlistItemRepository wishlistItemRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public WishlistServiceImpl(WishlistItemRepository wishlistItemRepository,
                               UserRepository userRepository,
                               ProductRepository productRepository) {
        this.wishlistItemRepository = wishlistItemRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }

    @Override
    public List<WishlistItemResponse> getWishlistForUser(Long userId) {
        return wishlistItemRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public WishlistItemResponse addProductToWishlist(Long userId, Long productId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + productId));

        wishlistItemRepository.findByUserIdAndProductId(userId, productId).ifPresent(item -> {
            throw new IllegalStateException("Product already in wishlist");
        });

        WishlistItem item = new WishlistItem(user, product);
        WishlistItem saved = wishlistItemRepository.save(item);
        return mapToResponse(saved);
    }

    @Override
    public void removeProductFromWishlist(Long userId, Long productId) {
        wishlistItemRepository.findByUserIdAndProductId(userId, productId)
                .orElseThrow(() -> new RuntimeException("Wishlist item not found"));
        wishlistItemRepository.deleteByUserIdAndProductId(userId, productId);
    }

    @Override
    public boolean isProductInWishlist(Long userId, Long productId) {
        return wishlistItemRepository.findByUserIdAndProductId(userId, productId).isPresent();
    }

    private WishlistItemResponse mapToResponse(WishlistItem item) {
        WishlistItemResponse response = new WishlistItemResponse();
        response.setId(item.getId());
        response.setProductId(item.getProduct().getId());
        response.setProductName(item.getProduct().getName());
        response.setProductDescription(item.getProduct().getDescription());
        response.setProductPrice(item.getProduct().getPrice());
        response.setAddedAt(item.getCreatedAt());
        return response;
    }
}
