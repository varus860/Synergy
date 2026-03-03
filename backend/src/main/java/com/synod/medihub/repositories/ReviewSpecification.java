package com.synod.medihub.repositories;

import com.synod.medihub.entities.Review;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class ReviewSpecification {

    public static Specification<Review> filterReviews(String search, Long productId) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (search != null && !search.isEmpty()) {
                String searchPattern = "%" + search.toLowerCase() + "%";
                Predicate commentPredicate = criteriaBuilder.like(criteriaBuilder.lower(root.get("comment")), searchPattern);
                
                // Join with user for searching user name
                Predicate userFirstNamePredicate = criteriaBuilder.like(criteriaBuilder.lower(root.get("user").get("firstName")), searchPattern);
                Predicate userLastNamePredicate = criteriaBuilder.like(criteriaBuilder.lower(root.get("user").get("lastName")), searchPattern);
                
                // Join with product for searching product name
                Predicate productNamePredicate = criteriaBuilder.like(criteriaBuilder.lower(root.get("product").get("name")), searchPattern);

                predicates.add(criteriaBuilder.or(commentPredicate, userFirstNamePredicate, userLastNamePredicate, productNamePredicate));
            }

            if (productId != null) {
                predicates.add(criteriaBuilder.equal(root.get("product").get("productId"), productId));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
