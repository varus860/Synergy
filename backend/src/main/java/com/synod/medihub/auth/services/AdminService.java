package com.synod.medihub.auth.services;

import com.synod.medihub.auth.config.JWTTokenHelper;
import com.synod.medihub.auth.dto.AdminLoginDto;
import com.synod.medihub.auth.dto.AdminRegistrationDto;
import com.synod.medihub.auth.entities.Admin;
import com.synod.medihub.auth.repositories.AdminRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;
    private final JWTTokenHelper jwtTokenHelper;
    private final AuthenticationManager authenticationManager;

    public Map<String, String> registerAdmin(AdminRegistrationDto dto) {
        if (adminRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Admin with this email already exists");
        }

        Admin admin = Admin.builder()
                .email(dto.getEmail())
                .password(passwordEncoder.encode(dto.getPassword()))
                .fullName(dto.getFullName())
                .role("ADMIN")
                .build();

        adminRepository.save(admin);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Admin registered successfully");
        return response;
    }

    public String loginAdmin(AdminLoginDto dto) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(dto.getEmail(), dto.getPassword())
        );

        if (authentication.isAuthenticated()) {
            Admin admin = adminRepository.findByEmail(dto.getEmail())
                    .orElseThrow(() -> new RuntimeException("Admin not found"));
            return jwtTokenHelper.generateToken(dto.getEmail(), admin.getFullName());
        }

        throw new RuntimeException("Invalid credentials");
    }
}
