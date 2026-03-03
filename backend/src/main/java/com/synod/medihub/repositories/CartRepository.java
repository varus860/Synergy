package com.synod.medihub.repositories;

import com.synod.medihub.entities.Cart;
import com.synod.medihub.auth.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {
    Optional<Cart> findByUser(User user);
    Optional<Cart> findByUser_Id(Long userId);
}
