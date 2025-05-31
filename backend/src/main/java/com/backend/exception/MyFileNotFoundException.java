// src/main/java/com/backend/exception/MyFileNotFoundException.java
package com.backend.exception; // Ensure this package matches your directory structure

public class MyFileNotFoundException extends RuntimeException {

    public MyFileNotFoundException(String message) {
        super(message);
    }

    public MyFileNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}