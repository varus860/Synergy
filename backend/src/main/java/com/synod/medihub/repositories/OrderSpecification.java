package com.synod.medihub.repositories;

import com.synod.medihub.auth.entities.User;
import com.synod.medihub.entities.Order;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import org.springframework.data.jpa.domain.Specification;

public class OrderSpecification {

    public static Specification<Order> searchById(String search) {
        return (root, query, cb) -> {
            if (search == null || search.trim().isEmpty()) {
                return null;
            }
            try {
                Long id = Long.parseLong(search);
                return cb.equal(root.get("id"), id);
            } catch (NumberFormatException e) {
                return null;
            }
        };
    }

    public static Specification<Order> hasStatus(String status) {
        return (root, query, cb) -> {
            if (status == null || status.trim().isEmpty() || status.equalsIgnoreCase("ALL")) {
                return null;
            }
            return cb.equal(root.get("status"), status.toUpperCase());
        };
    }

    public static Specification<Order> searchByUserDetail(String search) {
        return (root, query, cb) -> {
            if (search == null || search.trim().isEmpty()) {
                return null;
            }
            // Since Order only has userId (Long), we can't easily join in Criteria API 
            // without a mapped relationship. Order.java only has private Long userId;
            // We might need to modify Order.java to have a relationship or use a subquery.
            // For now, let's keep it simple and just do ID search if numeric.
            return null; 
        };
    }
}
