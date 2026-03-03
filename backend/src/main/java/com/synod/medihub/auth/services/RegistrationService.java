package com.synod.medihub.auth.services;

import com.synod.medihub.auth.dto.RegistrationRequest;
import com.synod.medihub.auth.dto.RegistrationResponse;
import com.synod.medihub.auth.entities.User;
import com.synod.medihub.auth.helper.VerificationCodeGenerator;
import com.synod.medihub.auth.repositories.UserDetailRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ServerErrorException;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class RegistrationService {

    @Autowired
    private UserDetailRepository userDetailRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    @org.springframework.beans.factory.annotation.Value("${app.registration.test-mode:false}")
    private boolean testMode;

    @Transactional
    public RegistrationResponse createUser(RegistrationRequest request) {

        User existing = userDetailRepository.findByEmail(request.getEmail());

        if(null != existing){
            return  RegistrationResponse.builder()
                    .code(400)
                    .message("Email already exist!")
                    .build();
        }

        try{

            User user = new User();
            user.setFirstName(request.getFirstName());
            user.setLastName(request.getLastName());
            user.setEmail(request.getEmail());
            user.setPhoneNumber(request.getPhoneNumber());
            user.setWorkplaceName(request.getWorkplaceName());
            user.setBusinessLicenseNumber(request.getBusinessLicenseNumber());
            user.setPhysicalAddress(request.getPhysicalAddress());
            user.setEnabled(false);
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            user.setProvider("manual");

            String code = VerificationCodeGenerator.generateCode();

            user.setVerificationCode(code);
            userDetailRepository.save(user);

            if (testMode) {
                log.info("Test Mode Active: Verification Code for {}: {}", user.getEmail(), code);
            } else {
                emailService.sendMail(user);
            }


            return RegistrationResponse.builder()
                    .code(200)
                    .message("User created!")
                    .verificationCode(testMode ? code : null)
                    .build();


        } catch (Exception e) {
            log.error("Error creating user: {}", e.getMessage(), e);
            throw new ServerErrorException(e.getMessage(),e.getCause());
        }
    }

    public void verifyUser(String userName) {
        User user= userDetailRepository.findByEmail(userName);
        user.setEnabled(true);
        userDetailRepository.save(user);
    }
}
