package com.synod.medihub.exceptions;

// Duplicate resource exception
public class DuplicateResourceException extends RuntimeException {
    public DuplicateResourceException(String message) {
        super(message);
    }
}
