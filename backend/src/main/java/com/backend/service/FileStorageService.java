package com.backend.service;

// src/main/java/com/example/researchbackendsimplified/service/FileStorageService.java


import com.backend.exception.FileStorageException;
import com.backend.exception.MyFileNotFoundException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageService {

    private final Path fileStorageLocation;

    public FileStorageService(@Value("${file.upload-dir:./uploads_simple}") String uploadDir) { // Default value if not in properties
        this.fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new FileStorageException("Could not create the directory where the uploaded files will be stored.", ex);
        }
    }

    public String storeFile(MultipartFile file, String subDirectory) {
        String originalFileName = StringUtils.cleanPath(file.getOriginalFilename());
        Path targetDirectory = this.fileStorageLocation.resolve(subDirectory).normalize();

        try {
            Files.createDirectories(targetDirectory); // Ensure subDirectory exists

            if (originalFileName.contains("..")) {
                throw new FileStorageException("Sorry! Filename contains invalid path sequence " + originalFileName);
            }

            String fileExtension = "";
            int i = originalFileName.lastIndexOf('.');
            if (i > 0) {
                fileExtension = originalFileName.substring(i);
            }
            String storedFileName = UUID.randomUUID().toString() + fileExtension;

            Path targetLocation = targetDirectory.resolve(storedFileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            // Return the path relative to the base upload directory for storage in DB
            return Paths.get(subDirectory).resolve(storedFileName).toString();
        } catch (IOException ex) {
            throw new FileStorageException("Could not store file " + originalFileName + ". Please try again!", ex);
        }
    }

    public Resource loadFileAsResource(String filePathString) { // filePathString is relative path from upload-dir
        try {
            Path filePath = this.fileStorageLocation.resolve(filePathString).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists()) {
                return resource;
            } else {
                throw new MyFileNotFoundException("File not found " + filePathString);
            }
        } catch (MalformedURLException ex) {
            throw new MyFileNotFoundException("File not found " + filePathString, ex);
        }
    }

    public void deleteFile(String filePathString) { // filePathString is relative path from upload-dir
        if (filePathString == null || filePathString.isBlank()) {
            // Log or handle cases where filePath is not set (e.g., production without a file)
            return;
        }
        try {
            Path filePath = this.fileStorageLocation.resolve(filePathString).normalize();
            Files.deleteIfExists(filePath);
        } catch (IOException ex) {
            throw new FileStorageException("Could not delete file " + filePathString + ". Please try again!", ex);
        }
    }
}
