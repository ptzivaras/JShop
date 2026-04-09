package com.ptprojects.eshopapi.dtos;

import java.util.List;

public class ShoppingCartResponse {

    private Long id;
    private Long userId;
    private String username;
    private List<CartItemResponse> cartItems;

    public ShoppingCartResponse() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public List<CartItemResponse> getCartItems() {
        return cartItems;
    }

    public void setCartItems(List<CartItemResponse> cartItems) {
        this.cartItems = cartItems;
    }
}
