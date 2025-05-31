// src/main/java/com/backend/exception/FileStorageException.java
package com.backend.exception; // Ensure this package matches your directory structure

public class FileStorageException extends RuntimeException {

    public FileStorageException(String message) {
        super(message);
    }

    public FileStorageException(String message, Throwable cause) {
        super(message, cause);
    }
}