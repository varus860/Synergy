package com.synod.medihub.repositories;

import com.synod.medihub.entities.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long>, JpaSpecificationExecutor<Review> {

    List<Review> findByProductProductId(Long productId);
    Page<Review> findByProductProductId(Long productId, Pageable pageable);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.product.productId = :productId")
    Double getAverageRatingByProductId(@Param("productId") Long productId);

    @Query("SELECT COUNT(r) FROM Review r WHERE r.product.productId = :productId")
    Long getReviewCountByProductId(@Param("productId") Long productId);
    
    /**
     * Check if a user has already reviewed a specific product.
     * Used to prevent duplicate reviews from the same user.
     * 
     * @param userId The ID of the user
     * @param productId The ID of the product
     * @return true if the user has already reviewed the product, false otherwise
     */
    boolean existsByUserIdAndProductProductId(Long userId, Long productId);
}

