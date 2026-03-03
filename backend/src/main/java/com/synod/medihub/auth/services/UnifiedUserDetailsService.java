package com.synod.medihub.auth.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Primary;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@Primary
@RequiredArgsConstructor
@Slf4j
public class UnifiedUserDetailsService implements UserDetailsService {

    private final AdminDetailsService adminDetailsService;
    private final CustomerDetailsService customerDetailsService;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        try {
            log.debug("Unified lookup: searching for Admin with email {}", username);
            return adminDetailsService.loadUserByUsername(username);
        } catch (UsernameNotFoundException e) {
            log.debug("Unified lookup: Admin not found, searching for Customer with email {}", username);
            try {
                return customerDetailsService.loadUserByUsername(username);
            } catch (UsernameNotFoundException ex) {
                log.error("Unified lookup: User not found with email: {}", username);
                throw new UsernameNotFoundException("User not found with email: " + username);
            }
        }
    }
}
