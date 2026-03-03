package com.synod.medihub.exceptions;

public class UsernameNotFoundException extends Exception {
    
    // Default constructor
    public UsernameNotFoundException() {
        super("Username not found.");
    }

    // Constructor that accepts a message
    public UsernameNotFoundException(String message) {
        super(message);
    }
}