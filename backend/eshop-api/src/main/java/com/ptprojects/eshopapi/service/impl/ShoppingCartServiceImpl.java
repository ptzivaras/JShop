package com.ptprojects.eshopapi.service.impl;

import com.ptprojects.eshopapi.domain.CartItem;
import com.ptprojects.eshopapi.domain.Product;
import com.ptprojects.eshopapi.domain.ShoppingCart;
import com.ptprojects.eshopapi.domain.User;
import com.ptprojects.eshopapi.dtos.AddToCartRequest;
import com.ptprojects.eshopapi.dtos.CartItemResponse;
import com.ptprojects.eshopapi.dtos.ShoppingCartResponse;
import com.ptprojects.eshopapi.repository.CartItemRepository;
import com.ptprojects.eshopapi.repository.ProductRepository;
import com.ptprojects.eshopapi.repository.ShoppingCartRepository;
import com.ptprojects.eshopapi.repository.UserRepository;
import com.ptprojects.eshopapi.service.ShoppingCartService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class ShoppingCartServiceImpl implements ShoppingCartService {

    private final ShoppingCartRepository shoppingCartRepository;
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public ShoppingCartServiceImpl(ShoppingCartRepository shoppingCartRepository,
                                   CartItemRepository cartItemRepository,
                                   UserRepository userRepository,
                                   ProductRepository productRepository) {
        this.shoppingCartRepository = shoppingCartRepository;
        this.cartItemRepository = cartItemRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }

    @Override
    public ShoppingCartResponse getCartByUserId(Long userId) {
        ShoppingCart cart = shoppingCartRepository.findByUserId(userId)
                .orElseGet(() -> {
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
                    ShoppingCart newCart = new ShoppingCart(user);
                    newCart.setCartItems(new ArrayList<>());
                    return shoppingCartRepository.save(newCart);
                });
        return mapToResponse(cart);
    }

    @Override
    @Transactional
    public ShoppingCartResponse addItemToCart(Long userId, AddToCartRequest request) {
        ShoppingCart cart = shoppingCartRepository.findByUserId(userId)
                .orElseGet(() -> {
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
                    ShoppingCart newCart = new ShoppingCart(user);
                    newCart.setCartItems(new ArrayList<>());
                    return shoppingCartRepository.save(newCart);
                });

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + request.getProductId()));

        CartItem cartItem = new CartItem(cart, product, request.getQuantity());
        cartItemRepository.save(cartItem);

        return getCartByUserId(userId);
    }

    @Override
    @Transactional
    public void removeItemFromCart(Long userId, Long itemId) {
        ShoppingCart cart = shoppingCartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Shopping cart not found for user: " + userId));

        CartItem cartItem = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found with id: " + itemId));

        if (!cartItem.getShoppingCart().getId().equals(cart.getId())) {
            throw new RuntimeException("Cart item does not belong to this user's cart");
        }

        cartItemRepository.delete(cartItem);
    }

    private ShoppingCartResponse mapToResponse(ShoppingCart cart) {
        ShoppingCartResponse response = new ShoppingCartResponse();
        response.setId(cart.getId());
        if (cart.getUser() != null) {
            response.setUserId(cart.getUser().getId());
            response.setUsername(cart.getUser().getUsername());
        }
        if (cart.getCartItems() != null) {
            List<CartItemResponse> items = cart.getCartItems().stream()
                    .map(this::mapItemToResponse)
                    .toList();
            response.setCartItems(items);
        }
        return response;
    }

    private CartItemResponse mapItemToResponse(CartItem item) {
        CartItemResponse response = new CartItemResponse();
        response.setId(item.getId());
        response.setQuantity(item.getQuantity());
        if (item.getProduct() != null) {
            response.setProductId(item.getProduct().getId());
            response.setProductName(item.getProduct().getName());
            response.setProductPrice(item.getProduct().getPrice());
        }
        return response;
    }
}
