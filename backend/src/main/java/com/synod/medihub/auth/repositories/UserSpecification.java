package com.synod.medihub.auth.repositories;

import com.synod.medihub.auth.entities.User;
import org.springframework.data.jpa.domain.Specification;

public class UserSpecification {

    public static Specification<User> search(String query) {
        return (root, criteriaQuery, cb) -> {
            if (query == null || query.trim().isEmpty()) {
                return null;
            }
            
            String pattern = "%" + query.toLowerCase() + "%";
            
            return cb.or(
                cb.like(cb.lower(root.get("firstName")), pattern),
                cb.like(cb.lower(root.get("lastName")), pattern),
                cb.like(cb.lower(root.get("email")), pattern)
            );
        };
    }
}
