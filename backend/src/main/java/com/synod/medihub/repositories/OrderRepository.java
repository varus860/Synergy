package com.synod.medihub.repositories;

import com.synod.medihub.entities.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long>, JpaSpecificationExecutor<Order> {
    List<Order> findByUserId(Long userId);
    
    /**
     * Check if a user has purchased a specific product.
     * Searches through all orders and their items to find if the user has ordered this product.
     * 
     * @param userId The ID of the user
     * @param productId The ID of the product
     * @return true if the user has purchased the product, false otherwise
     */
    @Query("SELECT CASE WHEN COUNT(oi) > 0 THEN true ELSE false END " +
           "FROM Order o JOIN o.items oi " +
           "WHERE o.userId = :userId AND oi.productId = :productId")
    boolean hasUserPurchasedProduct(@Param("userId") Long userId, @Param("productId") Long productId);

    @Query("SELECT SUM(o.totalAmount) FROM Order o WHERE o.date >= :sinceDate")
    java.math.BigDecimal sumTotalAmountSince(@Param("sinceDate") java.time.LocalDateTime sinceDate);

    long countByUserId(Long userId);

    @Query("SELECT SUM(o.totalAmount) FROM Order o WHERE o.userId = :userId")
    java.math.BigDecimal sumTotalAmountByUserId(@Param("userId") Long userId);
}
