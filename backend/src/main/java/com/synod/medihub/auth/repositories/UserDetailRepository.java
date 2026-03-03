package com.synod.medihub.auth.repositories;

import com.synod.medihub.auth.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface UserDetailRepository extends JpaRepository<User,Long>, JpaSpecificationExecutor<User> {
    User findByEmail(String username);
}
