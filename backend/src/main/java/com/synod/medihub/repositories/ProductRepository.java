package com.synod.medihub.repositories;

import com.synod.medihub.entities.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {

    // Custom query with @EntityGraph to load category eagerly
    @EntityGraph(attributePaths = {"category", "resources"})
    @Query("SELECT p FROM Product p WHERE p.productId = :id")
    Optional<Product> findProductWithCategoryById(@Param("id") Long id);

    Optional<Product> findByProductId(Long productId);

    // Find product with category eagerly loaded
    @EntityGraph(attributePaths = {"category"})
    @Query("SELECT p FROM Product p LEFT JOIN FETCH p.category WHERE p.productId = :id")
    Optional<Product> findByIdWithCategory(@Param("id") Long id);

    List<Product> findAllByOrderByProductIdAsc();

    Page<Product> findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String name, String description, Pageable pageable);
}
