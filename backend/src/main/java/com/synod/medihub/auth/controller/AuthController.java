package com.synod.medihub.auth.controller;

import com.synod.medihub.auth.config.JWTTokenHelper;
import com.synod.medihub.auth.dto.LoginRequest;
import com.synod.medihub.auth.dto.RegistrationRequest;
import com.synod.medihub.auth.dto.RegistrationResponse;
import com.synod.medihub.auth.dto.UserToken;
import com.synod.medihub.auth.entities.User;
import com.synod.medihub.auth.services.CustomerDetailsService;
import com.synod.medihub.auth.services.RegistrationService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@CrossOrigin
@RequestMapping("/api/auth")
@Slf4j
public class AuthController {

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    RegistrationService registrationService;

    @Autowired
    CustomerDetailsService userDetailsService;

    @Autowired
    JWTTokenHelper jwtTokenHelper;


    @PostMapping("/login")
    public ResponseEntity<UserToken> login(@RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = UsernamePasswordAuthenticationToken.unauthenticated(loginRequest.getUserName(),
                    loginRequest.getPassword());
            log.debug("Attempting login for user: {}", loginRequest.getUserName());

            Authentication authenticationResponse = this.authenticationManager.authenticate(authentication);
            if (authenticationResponse.isAuthenticated()) {
                log.debug("Authentication successful for user: {}", loginRequest.getUserName());
                org.springframework.security.core.userdetails.UserDetails userDetails = (org.springframework.security.core.userdetails.UserDetails) authenticationResponse.getPrincipal();
                if (!userDetails.isEnabled()) {
                    log.warn("Login failed: User account {} is not enabled (waiting for verification).", loginRequest.getUserName());
                    return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
                }
                log.info("Login successful: User {} logged in.", loginRequest.getUserName());
                String token = jwtTokenHelper.generateToken(userDetails.getUsername());
                UserToken userToken = UserToken.builder().token(token).build();
                return new ResponseEntity<>(userToken, HttpStatus.OK);
            }

        } catch (BadCredentialsException e) {
            log.warn("Login failed: Bad credentials for user {}", loginRequest.getUserName());
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
    }

    @PostMapping("/register")
    public ResponseEntity<RegistrationResponse> register(@RequestBody RegistrationRequest request){
        RegistrationResponse registrationResponse = registrationService.createUser(request);

        return new ResponseEntity<>(registrationResponse,
                registrationResponse.getCode() == 200 ? HttpStatus.OK: HttpStatus.BAD_REQUEST);
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyCode(@RequestBody Map<String,String> map){
        String userName = map.get("userName");
        String code = map.get("code");

        org.springframework.security.core.userdetails.UserDetails userDetails = userDetailsService.loadUserByUsername(userName);
        if (userDetails instanceof User user) {
            if (user.getVerificationCode().equals(code)) {
                registrationService.verifyUser(userName);
                return new ResponseEntity<>(HttpStatus.OK);
            }
        }
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }
}
