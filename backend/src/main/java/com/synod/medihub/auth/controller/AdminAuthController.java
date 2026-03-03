package com.synod.medihub.auth.controller;

import com.synod.medihub.auth.dto.AdminLoginDto;
import com.synod.medihub.auth.dto.AdminRegistrationDto;
import com.synod.medihub.auth.dto.UserToken;
import com.synod.medihub.auth.services.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin
@RequiredArgsConstructor
public class AdminAuthController {

    private final AdminService adminService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody AdminRegistrationDto registrationDto) {
        try {
            return ResponseEntity.ok(adminService.registerAdmin(registrationDto));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AdminLoginDto loginDto) {
        try {
            String token = adminService.loginAdmin(loginDto);
            return ResponseEntity.ok(UserToken.builder().token(token).build());
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", e.getMessage()));
        }
    }
}
