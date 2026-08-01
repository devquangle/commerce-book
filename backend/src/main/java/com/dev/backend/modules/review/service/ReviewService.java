package com.dev.backend.modules.review.service;

import com.dev.backend.modules.review.entity.Review;

import java.util.List;

public interface ReviewService {
    List<Review> getAllReviews();
    Review getReviewById(Long id);
    List<Review> getReviewsByProductId(Long productId);
    List<Review> getReviewsByUserId(Long userId);
    Review createReview(Review review);
    Review updateReview(Long id, Review review);
    void deleteReview(Long id);
}
