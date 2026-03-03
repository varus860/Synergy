package com.synod.medihub.controllers;

import com.synod.medihub.auth.entities.User;
import com.synod.medihub.dto.ReviewDto;
import com.synod.medihub.dto.ReviewStatsDto;
import com.synod.medihub.services.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * REST Controller for product reviews.
 * 
 * Public endpoints (no auth required):
 * - GET /api/reviews/product/{productId} - View all reviews for a product
 * - GET /api/reviews/product/{productId}/stats - Get aggregate review statistics
 * 
 * Protected endpoints (authentication required):
 * - POST /api/reviews - Create a new review
 * - GET /api/reviews/can-review/{productId} - Check if user can review a product
 */
@RestController
@RequestMapping("/api/reviews")
@CrossOrigin
public class ReviewController {

    private final ReviewService reviewService;

    @Autowired
    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    /**
     * Create a new review for a product.
     * Requires authentication - userId is extracted from the authenticated User object.
     * 
     * Backend validates:
     * - User has purchased the product
     * - User hasn't already reviewed the product
     * 
     * @param reviewDto Review data (productId, rating, comment)
     * @return Created review with HTTP 201, or error with appropriate status code
     */
    @PostMapping
    public ResponseEntity<?> createReview(@RequestBody ReviewDto reviewDto) {
        try {
            // Extract userId from authenticated user
            Long userId = getAuthenticatedUserId();
            if (userId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "User not authenticated"));
            }
            
            // Set the userId from the authenticated user (don't trust client)
            reviewDto.setUserId(userId);
            
            // Create the review (service handles validation)
            ReviewDto createdReview = reviewService.createReview(reviewDto);
            return new ResponseEntity<>(createdReview, HttpStatus.CREATED);
            
        } catch (RuntimeException e) {
            // Handle specific business logic errors with appropriate HTTP status codes
            String errorMessage = e.getMessage();
            
            if (errorMessage.contains("must purchase")) {
                // User hasn't purchased the product
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", errorMessage));
            } else if (errorMessage.contains("already reviewed")) {
                // User has already reviewed this product
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(Map.of("error", errorMessage));
            } else {
                // Other errors (product not found, etc.)
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", errorMessage));
            }
        }
    }

    /**
     * Get paginated reviews for a specific product.
     * Public endpoint - no authentication required.
     * Anyone can view product reviews.
     * 
     * @param productId The ID of the product
     * @param page Page number (0-indexed)
     * @param size Number of reviews per page
     * @return Page of reviews for the product
     */
    @GetMapping("/product/{productId}")
    public ResponseEntity<Page<ReviewDto>> getReviewsByProduct(
            @PathVariable Long productId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<ReviewDto> reviews = reviewService.getReviewsByProduct(productId, pageable);
        return ResponseEntity.ok(reviews);
    }

    /**
     * Get aggregate review statistics for a product.
     * Public endpoint - no authentication required.
     * Returns average rating and total review count.
     * 
     * @param productId The ID of the product
     * @return ReviewStatsDto with averageRating and reviewCount
     */
    @GetMapping("/product/{productId}/stats")
    public ResponseEntity<ReviewStatsDto> getProductReviewStats(@PathVariable Long productId) {
        ReviewStatsDto stats = reviewService.getReviewStats(productId);
        return ResponseEntity.ok(stats);
    }

    /**
     * Check if the authenticated user can review a specific product.
     * Requires authentication.
     * 
     * User can review if:
     * - They have purchased the product
     * - They haven't already reviewed it
     * 
     * @param productId The ID of the product
     * @return Map with "canReview" boolean and optional "reason" for why they cannot review
     */
    @GetMapping("/can-review/{productId}")
    public ResponseEntity<Map<String, Object>> canReview(@PathVariable Long productId) {
        Long userId = getAuthenticatedUserId();
        
        if (userId == null) {
            Map<String, Object> response = new HashMap<>();
            response.put("canReview", false);
            response.put("reason", "not_authenticated");
            return ResponseEntity.ok(response);
        }
        
        boolean canReview = reviewService.canUserReviewProduct(userId, productId);
        Map<String, Object> response = new HashMap<>();
        response.put("canReview", canReview);
        
        if (!canReview) {
            // Determine the specific reason why user cannot review
            if (!reviewService.hasUserPurchasedProduct(userId, productId)) {
                response.put("reason", "not_purchased");
            } else {
                response.put("reason", "already_reviewed");
            }
        }
        
        return ResponseEntity.ok(response);
    }

    /**
     * Extract the authenticated user's ID from the security context.
     * 
     * The JWT authentication filter sets the User object as the principal
     * in the security context. We can directly cast it to User and get the ID.
     * 
     * @return The user ID, or null if not authenticated
     */
    private Long getAuthenticatedUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        // Check if user is authenticated
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }
        
        Object principal = authentication.getPrincipal();
        
        // The principal should be our custom User object (implements UserDetails)
        if (principal instanceof User) {
            User user = (User) principal;
            return user.getId();
        }
        
        // If we reach here, authentication is in an unexpected format
        System.err.println("Unexpected principal type: " + principal.getClass().getName());
        return null;
    }
}
