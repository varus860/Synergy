package com.synod.medihub.repositories;

import com.synod.medihub.entities.Category;
import com.synod.medihub.entities.Product;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    // Check if category exists by code
    boolean existsByCode(String code);

    // Check if category exists by name
    boolean existsByName(String name);

    // Find category with products eagerly loaded
    @EntityGraph(attributePaths = {"productList"})
    @Query("SELECT c FROM Category c LEFT JOIN FETCH c.productList WHERE c.categoryId = :id")
    Optional<Category> findByIdWithProducts(@Param("id") Long id);

}
