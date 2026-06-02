package com.busTimetable.exception;

/**
 * Thrown when a requested resource (e.g. a bus record by ID) does not exist.
 * The GlobalExceptionHandler maps this to HTTP 404 Not Found.
 */
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
