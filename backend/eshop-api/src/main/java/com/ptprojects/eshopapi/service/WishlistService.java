package com.ptprojects.eshopapi.service;

import com.ptprojects.eshopapi.dtos.WishlistItemResponse;

import java.util.List;

public interface WishlistService {

    List<WishlistItemResponse> getWishlistForUser(Long userId);

    WishlistItemResponse addProductToWishlist(Long userId, Long productId);

    void removeProductFromWishlist(Long userId, Long productId);

    boolean isProductInWishlist(Long userId, Long productId);
}
