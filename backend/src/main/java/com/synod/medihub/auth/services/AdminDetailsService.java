package com.synod.medihub.auth.services;

import com.synod.medihub.auth.entities.Admin;
import com.synod.medihub.auth.repositories.AdminRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminDetailsService implements UserDetailsService {

    private final AdminRepository adminRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return adminRepository.findByEmail(username)
                .map(admin -> (UserDetails) admin)
                .orElseThrow(() -> new UsernameNotFoundException("Admin not found with email: " + username));
    }
}
