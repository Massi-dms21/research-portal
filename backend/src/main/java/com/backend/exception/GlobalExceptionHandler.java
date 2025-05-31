// src/main/java/com/backend/exception/GlobalExceptionHandler.java
package com.backend.exception; // Ensure this is your correct package for exceptions

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.multipart.support.MissingServletRequestPartException; // Correct import

import java.util.Date; // Using java.util.Date
import java.util.HashMap;
import java.util.Map;

// Inner class for structuring error responses
class ErrorDetails {
    private Date timestamp;
    private String message;
    private String details;
    private Map<String, String> validationErrors; // For validation errors

    // Constructor for general errors
    public ErrorDetails(Date timestamp, String message, String details) {
        super();
        this.timestamp = timestamp;
        this.message = message;
        this.details = details;
    }

    // Constructor for validation errors
    public ErrorDetails(Date timestamp, String message, String details, Map<String, String> validationErrors) {
        this(timestamp, message, details); // Calls the other constructor
        this.validationErrors = validationErrors;
    }

    // Getters
    public Date getTimestamp() {
        return timestamp;
    }

    public String getMessage() {
        return message;
    }

    public String getDetails() {
        return details;
    }

    public Map<String, String> getValidationErrors() {
        return validationErrors;
    }
}

@ControllerAdvice
public class GlobalExceptionHandler {

    // Handle specific custom exceptions
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<?> resourceNotFoundException(ResourceNotFoundException ex, WebRequest request) {
        ErrorDetails errorDetails = new ErrorDetails(new Date(), ex.getMessage(), request.getDescription(false));
        return new ResponseEntity<>(errorDetails, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(FileStorageException.class)
    public ResponseEntity<?> fileStorageException(FileStorageException ex, WebRequest request) {
        ErrorDetails errorDetails = new ErrorDetails(new Date(), "File Storage Error: " + ex.getMessage(), request.getDescription(false));
        return new ResponseEntity<>(errorDetails, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(MyFileNotFoundException.class)
    public ResponseEntity<?> myFileNotFoundException(MyFileNotFoundException ex, WebRequest request) {
        ErrorDetails errorDetails = new ErrorDetails(new Date(), "File Not Found: " + ex.getMessage(), request.getDescription(false));
        return new ResponseEntity<>(errorDetails, HttpStatus.NOT_FOUND);
    }

    // Handle bean validation exceptions (@Valid) from request bodies
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleValidationExceptions(MethodArgumentNotValidException ex, WebRequest request) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        ErrorDetails errorDetails = new ErrorDetails(new Date(), "Validation Failed", request.getDescription(false), errors);
        return new ResponseEntity<>(errorDetails, HttpStatus.BAD_REQUEST);
    }

    // Handle missing request part (e.g., for multipart file uploads when a required part is missing)
    @ExceptionHandler(MissingServletRequestPartException.class)
    public ResponseEntity<?> handleMissingServletRequestPartException(MissingServletRequestPartException ex, WebRequest request) {
        ErrorDetails errorDetails = new ErrorDetails(new Date(), "Required request part '" + ex.getRequestPartName() + "' is not present", request.getDescription(false));
        return new ResponseEntity<>(errorDetails, HttpStatus.BAD_REQUEST);
    }

    // Handle generic exceptions (catch-all for anything not specifically handled above)
    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> globalExceptionHandler(Exception ex, WebRequest request) {
        // Log the full stack trace for debugging purposes, especially in development
        System.err.println("An unexpected error occurred: ");
        ex.printStackTrace(); // Or use a proper logger like SLF4J

        ErrorDetails errorDetails = new ErrorDetails(new Date(), "An unexpected error occurred. Please try again later.", request.getDescription(false));
        // For production, you might not want to expose ex.getMessage() directly if it contains sensitive info.
        // ErrorDetails errorDetails = new ErrorDetails(new Date(), "An unexpected internal error occurred.", request.getDescription(false));
        return new ResponseEntity<>(errorDetails, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}