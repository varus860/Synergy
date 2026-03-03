package com.synod.medihub.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDetailsDto {

    private long id;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String email;
    private String workplaceName;
    private String businessLicenseNumber;
    private String physicalAddress;
    private Object authorityList;
}