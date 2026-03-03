package com.synod.medihub.auth.services;

import com.synod.medihub.auth.entities.User;
import com.synod.medihub.auth.repositories.UserDetailRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomerDetailsService implements UserDetailsService {

    private final UserDetailRepository userDetailRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userDetailRepository.findByEmail(username);
        if (user == null) {
            throw new UsernameNotFoundException("Customer not found with email: " + username);
        }
        return user;
    }
}
