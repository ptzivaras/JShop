package com.ptprojects.eshopapi.service;

import com.ptprojects.eshopapi.dtos.AddToCartRequest;
import com.ptprojects.eshopapi.dtos.ShoppingCartResponse;

public interface ShoppingCartService {

    ShoppingCartResponse getCartByUserId(Long userId);

    ShoppingCartResponse addItemToCart(Long userId, AddToCartRequest request);

    void removeItemFromCart(Long userId, Long itemId);
}
