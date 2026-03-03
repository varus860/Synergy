package com.synod.medihub.auth.controller;

import com.synod.medihub.auth.dto.UserDetailsDto;
import com.synod.medihub.auth.entities.Admin;
import com.synod.medihub.auth.entities.User;
import com.synod.medihub.auth.services.UnifiedUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

@RestController
@CrossOrigin
@RequestMapping("/api/user")
public class UserDetailController {

    @Autowired
    private UnifiedUserDetailsService userDetailsService;

    @GetMapping("/profile")
    public ResponseEntity<UserDetailsDto> getUserProfile(Principal principal){
        UserDetails userDetails = userDetailsService.loadUserByUsername(principal.getName());

        UserDetailsDto.UserDetailsDtoBuilder builder = UserDetailsDto.builder();

        if (userDetails instanceof User user) {
            builder.firstName(user.getFirstName())
                    .lastName(user.getLastName())
                    .email(user.getEmail())
                    .id(user.getId())
                    .phoneNumber(user.getPhoneNumber())
                    .workplaceName(user.getWorkplaceName())
                    .businessLicenseNumber(user.getBusinessLicenseNumber())
                    .physicalAddress(user.getPhysicalAddress())
                    .authorityList(user.getAuthorities().toArray());
        } else if (userDetails instanceof Admin admin) {
            // Populate logic for Admins
            String[] names = admin.getFullName() != null ? admin.getFullName().split(" ", 2) : new String[]{"Admin", ""};
            builder.firstName(names[0])
                    .lastName(names.length > 1 ? names[1] : "")
                    .email(admin.getEmail())
                    .id(admin.getId())
                    .authorityList(admin.getAuthorities().toArray());
        } else {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        return new ResponseEntity<>(builder.build(), HttpStatus.OK);
    }
}
