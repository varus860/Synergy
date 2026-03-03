package com.synod.medihub.services;

import com.synod.medihub.auth.entities.User;
import com.synod.medihub.auth.repositories.UserDetailRepository;
import com.synod.medihub.dto.ReviewDto;
import com.synod.medihub.dto.ReviewStatsDto;
import com.synod.medihub.entities.Product;
import com.synod.medihub.entities.Review;
import com.synod.medihub.repositories.OrderRepository;
import com.synod.medihub.repositories.ProductRepository;
import com.synod.medihub.repositories.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.synod.medihub.repositories.ReviewSpecification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final UserDetailRepository userDetailRepository;
    private final OrderRepository orderRepository;

    @Autowired
    public ReviewService(ReviewRepository reviewRepository, 
                        ProductRepository productRepository, 
                        UserDetailRepository userDetailRepository,
                        OrderRepository orderRepository) {
        this.reviewRepository = reviewRepository;
        this.productRepository = productRepository;
        this.userDetailRepository = userDetailRepository;
        this.orderRepository = orderRepository;
    }

    /**
     * Create a new review for a product.
     * Validates that the user has purchased the product and hasn't already reviewed it.
     * 
     * @param reviewDto The review data
     * @return The created review as a DTO
     * @throws RuntimeException if product/user not found, user hasn't purchased product, or already reviewed
     */
    public ReviewDto createReview(ReviewDto reviewDto) {
        Product product = productRepository.findById(reviewDto.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));
        
        User user = userDetailRepository.findById(reviewDto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if user has purchased the product
        if (!hasUserPurchasedProduct(reviewDto.getUserId(), reviewDto.getProductId())) {
            throw new RuntimeException("You must purchase this product before leaving a review");
        }

        // Check if user has already reviewed this product
        if (reviewRepository.existsByUserIdAndProductProductId(reviewDto.getUserId(), reviewDto.getProductId())) {
            throw new RuntimeException("You have already reviewed this product");
        }

        Review review = Review.builder()
                .rating(reviewDto.getRating())
                .comment(reviewDto.getComment())
                .product(product)
                .user(user)
                .build();

        Review savedReview = reviewRepository.save(review);
        return mapToDto(savedReview);
    }

    /**
     * Get paginated reviews for a specific product.
     * This is a public endpoint - anyone can view reviews.
     * 
     * @param productId The ID of the product
     * @param pageable Pagination information
     * @return Page of reviews for the product
     */
    public Page<ReviewDto> getReviewsByProduct(Long productId, Pageable pageable) {
        return reviewRepository.findByProductProductId(productId, pageable)
                .map(this::mapToDto);
    }

    /**
     * Get aggregate review statistics for a product.
     * Returns average rating and total review count.
     * 
     * @param productId The ID of the product
     * @return ReviewStatsDto containing average rating and count
     */
    public ReviewStatsDto getReviewStats(Long productId) {
        Double averageRating = reviewRepository.getAverageRatingByProductId(productId);
        Long reviewCount = reviewRepository.getReviewCountByProductId(productId);
        
        return ReviewStatsDto.builder()
                .averageRating(averageRating != null ? averageRating : 0.0)
                .reviewCount(reviewCount != null ? reviewCount : 0L)
                .build();
    }

    /**
     * Check if a user can review a specific product.
     * User must have purchased the product and not already reviewed it.
     * 
     * @param userId The ID of the user
     * @param productId The ID of the product
     * @return true if user can review, false otherwise
     */
    public boolean canUserReviewProduct(Long userId, Long productId) {
        // User must have purchased the product
        if (!hasUserPurchasedProduct(userId, productId)) {
            return false;
        }
        
        // User must not have already reviewed the product
        return !reviewRepository.existsByUserIdAndProductProductId(userId, productId);
    }

    /**
     * Check if a user has purchased a specific product.
     * Queries the order history to verify purchase.
     * 
     * @param userId The ID of the user
     * @param productId The ID of the product
     * @return true if user has purchased the product, false otherwise
     */
    public boolean hasUserPurchasedProduct(Long userId, Long productId) {
        return orderRepository.hasUserPurchasedProduct(userId, productId);
    }

    /**
     * Map a Review entity to a ReviewDto.
     * 
     * @param review The review entity
     * @return The review DTO
     */
    private ReviewDto mapToDto(Review review) {
        return ReviewDto.builder()
                .reviewId(review.getReviewId())
                .rating(review.getRating())
                .comment(review.getComment())
                .userId(review.getUser().getId())
                .userName(review.getUser().getFirstName() + " " + review.getUser().getLastName())
                .productId(review.getProduct().getProductId())
                .createdAt(review.getCreatedAt())
                .build();
    }

    /**
     * Get paginated reviews for admin with optional filtering.
     * 
     * @param search Search term (content, user, product)
     * @param productId Optional product ID filter
     * @param pageable Pagination info
     * @return Page of ReviewDto
     */
    public Page<ReviewDto> getReviewsForAdmin(String search, Long productId, Pageable pageable) {
        Specification<Review> spec = ReviewSpecification.filterReviews(search, productId);
        Page<Review> reviewPage = reviewRepository.findAll(spec, pageable);
        return reviewPage.map(this::mapToDto);
    }

    /**
     * Delete a review by ID.
     * 
     * @param reviewId The ID of the review to delete
     */
    public void deleteReview(Long reviewId) {
        if (!reviewRepository.existsById(reviewId)) {
            throw new RuntimeException("Review not found");
        }
        reviewRepository.deleteById(reviewId);
    }
}
