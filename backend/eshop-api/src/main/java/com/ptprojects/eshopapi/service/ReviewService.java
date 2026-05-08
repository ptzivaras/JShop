package com.ptprojects.eshopapi.service;

import com.ptprojects.eshopapi.dtos.ReviewRequest;
import com.ptprojects.eshopapi.dtos.ReviewResponse;

import java.util.List;
import java.util.Map;

public interface ReviewService {

    ReviewResponse createReview(Long productId, Long userId, ReviewRequest request);

    ReviewResponse updateReview(Long reviewId, Long userId, ReviewRequest request);

    void deleteReview(Long reviewId, Long userId);

    List<ReviewResponse> getReviewsByProduct(Long productId);

    List<ReviewResponse> getReviewsByUser(Long userId);

    Map<String, Object> getProductRatingSummary(Long productId);
}
