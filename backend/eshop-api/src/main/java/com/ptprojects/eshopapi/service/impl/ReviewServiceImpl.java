package com.ptprojects.eshopapi.service.impl;

import com.ptprojects.eshopapi.domain.Product;
import com.ptprojects.eshopapi.domain.Review;
import com.ptprojects.eshopapi.domain.User;
import com.ptprojects.eshopapi.dtos.ReviewRequest;
import com.ptprojects.eshopapi.dtos.ReviewResponse;
import com.ptprojects.eshopapi.repository.ProductRepository;
import com.ptprojects.eshopapi.repository.ReviewRepository;
import com.ptprojects.eshopapi.repository.UserRepository;
import com.ptprojects.eshopapi.service.ReviewService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public ReviewServiceImpl(ReviewRepository reviewRepository, ProductRepository productRepository, UserRepository userRepository) {
        this.reviewRepository = reviewRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    @Override
    public ReviewResponse createReview(Long productId, Long userId, ReviewRequest request) {
        // Validate rating
        if (request.getRating() == null || request.getRating() < 1 || request.getRating() > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5");
        }

        // Check product exists
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + productId));

        // Check user exists
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        // Check if user already reviewed this product
        if (reviewRepository.findByProductIdAndUserId(productId, userId).isPresent()) {
            throw new IllegalStateException("User has already reviewed this product");
        }

        Review review = new Review(product, user, request.getRating(), request.getComment());
        Review saved = reviewRepository.save(review);
        return mapToResponse(saved);
    }

    @Override
    public ReviewResponse updateReview(Long reviewId, Long userId, ReviewRequest request) {
        // Validate rating
        if (request.getRating() == null || request.getRating() < 1 || request.getRating() > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5");
        }

        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found with id: " + reviewId));

        // Check ownership
        if (!review.getUser().getId().equals(userId)) {
            throw new IllegalStateException("You can only update your own reviews");
        }

        review.setRating(request.getRating());
        review.setComment(request.getComment());
        Review saved = reviewRepository.save(review);
        return mapToResponse(saved);
    }

    @Override
    public void deleteReview(Long reviewId, Long userId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found with id: " + reviewId));

        // Check ownership
        if (!review.getUser().getId().equals(userId)) {
            throw new IllegalStateException("You can only delete your own reviews");
        }

        reviewRepository.deleteById(reviewId);
    }

    @Override
    public List<ReviewResponse> getReviewsByProduct(Long productId) {
        // Check product exists
        if (!productRepository.existsById(productId)) {
            throw new RuntimeException("Product not found with id: " + productId);
        }
        return reviewRepository.findByProductIdOrderByCreatedAtDesc(productId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public List<ReviewResponse> getReviewsByUser(Long userId) {
        // Check user exists
        if (!userRepository.existsById(userId)) {
            throw new RuntimeException("User not found with id: " + userId);
        }
        return reviewRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public Map<String, Object> getProductRatingSummary(Long productId) {
        List<Review> reviews = reviewRepository.findByProductIdOrderByCreatedAtDesc(productId);

        if (reviews.isEmpty()) {
            return Map.of(
                    "averageRating", 0.0,
                    "totalReviews", 0,
                    "ratingDistribution", Map.of()
            );
        }

        double averageRating = reviews.stream()
                .mapToInt(Review::getRating)
                .average()
                .orElse(0.0);

        Map<Integer, Long> distribution = reviews.stream()
                .collect(java.util.stream.Collectors.groupingBy(
                        Review::getRating,
                        java.util.stream.Collectors.counting()
                ));

        return Map.of(
                "averageRating", Math.round(averageRating * 10.0) / 10.0,
                "totalReviews", reviews.size(),
                "ratingDistribution", distribution
        );
    }

    private ReviewResponse mapToResponse(Review review) {
        return new ReviewResponse(
                review.getId(),
                review.getProduct().getId(),
                review.getUser().getId(),
                review.getUser().getUsername(),
                review.getRating(),
                review.getComment(),
                review.getCreatedAt(),
                review.getUpdatedAt()
        );
    }
}
