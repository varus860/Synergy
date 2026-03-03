package com.synod.medihub.auth.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.jspecify.annotations.Nullable;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;
import java.util.Date;
import java.util.List;

@Table(name = "AUTH_USER_DETAILS")
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User implements UserDetails {

    @Id
    @GeneratedValue
    private long id;

    private String firstName;

    private String lastName;

    @JsonIgnore
    private String password;

    private Date createdOn;

    private Date updatedOn;

    @Column(nullable = false,unique = true)
    private String email;

    private String phoneNumber;

    private String workplaceName;

    private String businessLicenseNumber;

    private String physicalAddress;

    private String provider;

    private String verificationCode;

    private boolean enabled;

    @Builder.Default
    private String role = "USER";


    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + role));
    }

    @Override
    public String getPassword() {
        return this.password;
    }

    @Override
    public String getUsername() {
        return this.email;
    }

    @PrePersist
    protected void onCreate() {
        this.createdOn = new Date();
        this.updatedOn = createdOn;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedOn = new Date();
    }
}
