package com.ptprojects.eshopapi.service.impl;

import com.ptprojects.eshopapi.domain.Category;
import com.ptprojects.eshopapi.domain.Product;
import com.ptprojects.eshopapi.dtos.ProductRequest;
import com.ptprojects.eshopapi.dtos.ProductResponse;
import com.ptprojects.eshopapi.repository.CategoryRepository;
import com.ptprojects.eshopapi.repository.ProductRepository;
import com.ptprojects.eshopapi.service.ProductService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public ProductServiceImpl(ProductRepository productRepository, CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    @Override
    public List<ProductResponse> getAllProducts() {
        return productRepository.findAll().stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public List<ProductResponse> searchProducts(String q, Long categoryId, Double minPrice, Double maxPrice, String stockStatus, String sortBy, String sortDir) {
        boolean hasQuery = q != null && !q.isBlank();
        boolean hasCategory = categoryId != null;
        boolean hasMinPrice = minPrice != null;
        boolean hasMaxPrice = maxPrice != null;
        boolean hasStockStatus = stockStatus != null && !stockStatus.isBlank();

        List<Product> results;
        if (hasQuery && hasCategory) {
            results = productRepository.findByNameContainingIgnoreCaseAndCategoryId(q, categoryId);
        } else if (hasQuery) {
            results = productRepository.findByNameContainingIgnoreCase(q);
        } else if (hasCategory) {
            results = productRepository.findByCategoryId(categoryId);
        } else {
            results = productRepository.findAll();
        }

        // Apply additional filters
        results = results.stream()
                .filter(product -> !hasMinPrice || product.getPrice() >= minPrice)
                .filter(product -> !hasMaxPrice || product.getPrice() <= maxPrice)
                .filter(product -> !hasStockStatus || matchesStockStatus(product, stockStatus))
                .toList();

        // Apply sorting
        results = sortProducts(results, sortBy, sortDir);

        return results.stream().map(this::mapToResponse).toList();
    }

    private boolean matchesStockStatus(Product product, String stockStatus) {
        int stock = product.getStockQuantity();
        return switch (stockStatus.toLowerCase()) {
            case "in-stock" -> stock > 5; // Assuming LOW_STOCK_THRESHOLD = 5
            case "low-stock" -> stock > 0 && stock <= 5;
            case "out-of-stock" -> stock == 0;
            default -> true;
        };
    }

    private List<Product> sortProducts(List<Product> products, String sortBy, String sortDir) {
        boolean ascending = "asc".equalsIgnoreCase(sortDir);
        return products.stream()
                .sorted((p1, p2) -> {
                    int cmp = 0;
                    switch (sortBy.toLowerCase()) {
                        case "name" -> cmp = p1.getName().compareToIgnoreCase(p2.getName());
                        case "price" -> cmp = Double.compare(p1.getPrice(), p2.getPrice());
                        case "stock" -> cmp = Integer.compare(p1.getStockQuantity(), p2.getStockQuantity());
                        default -> cmp = 0;
                    }
                    return ascending ? cmp : -cmp;
                })
                .toList();
    }

    @Override
    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        return mapToResponse(product);
    }

    @Override
    public ProductResponse createProduct(ProductRequest request) {
        Product product = new Product();
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setStockQuantity(request.getStockQuantity());

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found with id: " + request.getCategoryId()));
            product.setCategory(category);
        }

        Product saved = productRepository.save(product);
        return mapToResponse(saved);
    }

    @Override
    public ProductResponse updateProduct(Long id, ProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setStockQuantity(request.getStockQuantity());

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found with id: " + request.getCategoryId()));
            product.setCategory(category);
        } else {
            product.setCategory(null);
        }

        Product saved = productRepository.save(product);
        return mapToResponse(saved);
    }

    @Override
    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new RuntimeException("Product not found with id: " + id);
        }
        productRepository.deleteById(id);
    }

    private ProductResponse mapToResponse(Product product) {
        ProductResponse response = new ProductResponse();
        response.setId(product.getId());
        response.setName(product.getName());
        response.setDescription(product.getDescription());
        response.setPrice(product.getPrice());
        response.setStockQuantity(product.getStockQuantity());
        if (product.getCategory() != null) {
            response.setCategoryId(product.getCategory().getId());
            response.setCategoryName(product.getCategory().getName());
        }
        return response;
    }
}
