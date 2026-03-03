package com.synod.medihub.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object for product review statistics.
 * Used to return aggregate review data including average rating and total count.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewStatsDto {
    
    /**
     * Average rating across all reviews for a product.
     * Returns 0.0 if no reviews exist.
     */
    private Double averageRating;
    
    /**
     * Total number of reviews for a product.
     */
    private Long reviewCount;
}
