package com.ptprojects.eshopapi.service;

import com.ptprojects.eshopapi.dtos.ProductRequest;
import com.ptprojects.eshopapi.dtos.ProductResponse;

import java.util.List;

public interface ProductService {

    List<ProductResponse> getAllProducts();

    ProductResponse getProductById(Long id);

    ProductResponse createProduct(ProductRequest request);

    ProductResponse updateProduct(Long id, ProductRequest request);

    void deleteProduct(Long id);
}
