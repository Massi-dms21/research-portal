package com.backend.controller;

// src/main/java/com/example/researchbackendsimplified/controller/ScientificProductionController.java


import com.backend.model.ScientificProduction;
import com.backend.service.FileStorageService;
import com.backend.service.ScientificProductionService;
import jakarta.servlet.http.HttpServletRequest; // For determining MIME type
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/productions")
@CrossOrigin("*")
public class ScientificProductionController {

    @Autowired
    private ScientificProductionService scientificProductionService;

    @Autowired
    private FileStorageService fileStorageService;

    // Create: Pass ScientificProduction data as JSON, file as multipart, authorId as param
    @PostMapping(consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<ScientificProduction> createScientificProduction(
            @RequestPart("production") @Valid ScientificProduction production, // JSON part
            @RequestPart("authorId") String authorIdStr, // Ensure this is sent as a form part
            @RequestPart(name = "researchProjectId", required = false) String researchProjectIdStr,
            @RequestPart(name = "file", required = false) MultipartFile file) {

        Long authorId = Long.parseLong(authorIdStr);
        Long researchProjectId = (researchProjectIdStr != null && !researchProjectIdStr.isEmpty()) ? Long.parseLong(researchProjectIdStr) : null;

        ScientificProduction createdProduction = scientificProductionService.createProduction(production, authorId, researchProjectId, file);
        return new ResponseEntity<>(createdProduction, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ScientificProduction> getScientificProductionById(@PathVariable Long id) {
        ScientificProduction production = scientificProductionService.getProductionByIdOrThrow(id);
        return ResponseEntity.ok(production);
    }

    @GetMapping
    public ResponseEntity<List<ScientificProduction>> getAllScientificProductions() {
        List<ScientificProduction> productions = scientificProductionService.getAllProductions();
        return ResponseEntity.ok(productions);
    }

    @GetMapping("/author/{authorId}")
    public ResponseEntity<List<ScientificProduction>> getProductionsByAuthor(@PathVariable Long authorId) {
        List<ScientificProduction> productions = scientificProductionService.getProductionsByAuthorId(authorId);
        return ResponseEntity.ok(productions);
    }

    @PutMapping(value = "/{id}", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<ScientificProduction> updateScientificProduction(
            @PathVariable Long id,
            @RequestPart("production") @Valid ScientificProduction productionDetails,
            @RequestPart(name = "researchProjectId", required = false) String researchProjectIdStr,
            @RequestPart(name = "file", required = false) MultipartFile file) {

        Long researchProjectId = (researchProjectIdStr != null && !researchProjectIdStr.isEmpty()) ? Long.parseLong(researchProjectIdStr) : null;

        ScientificProduction updatedProduction = scientificProductionService.updateProduction(id, productionDetails, researchProjectId, file);
        return ResponseEntity.ok(updatedProduction);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteScientificProduction(@PathVariable Long id) {
        scientificProductionService.deleteProduction(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/file")
    public ResponseEntity<Resource> downloadFile(@PathVariable Long id, HttpServletRequest request) {
        ScientificProduction production = scientificProductionService.getProductionByIdOrThrow(id);
        if (production.getFilePath() == null || production.getFilePath().isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Resource resource = fileStorageService.loadFileAsResource(production.getFilePath());
        String contentType = null;
        try {
            contentType = request.getServletContext().getMimeType(resource.getFile().getAbsolutePath());
        } catch (IOException ex) {
            // log error or ignore
        }
        if (contentType == null) {
            contentType = "application/octet-stream"; // Default content type
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + production.getOriginalFileName() + "\"")
                .body(resource);
    }
}
