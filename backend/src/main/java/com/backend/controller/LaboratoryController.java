package com.backend.controller;

// src/main/java/com/example/researchbackendsimplified/controller/LaboratoryController.java


import com.backend.model.Laboratory;
import com.backend.service.LaboratoryService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/laboratories")
@CrossOrigin("*")
public class LaboratoryController {

    @Autowired
    private LaboratoryService laboratoryService;

    @PostMapping
    public ResponseEntity<Laboratory> createLaboratory(@Valid @RequestBody Laboratory laboratory) {
        Laboratory createdLaboratory = laboratoryService.createLaboratory(laboratory);
        return new ResponseEntity<>(createdLaboratory, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Laboratory> getLaboratoryById(@PathVariable Long id) {
        Laboratory laboratory = laboratoryService.getLaboratoryByIdOrThrow(id);
        return ResponseEntity.ok(laboratory);
    }

    @GetMapping
    public ResponseEntity<List<Laboratory>> getAllLaboratories() {
        List<Laboratory> laboratories = laboratoryService.getAllLaboratories();
        return ResponseEntity.ok(laboratories);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Laboratory> updateLaboratory(@PathVariable Long id, @Valid @RequestBody Laboratory laboratoryDetails) {
        Laboratory updatedLaboratory = laboratoryService.updateLaboratory(id, laboratoryDetails);
        return ResponseEntity.ok(updatedLaboratory);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLaboratory(@PathVariable Long id) {
        laboratoryService.deleteLaboratory(id);
        return ResponseEntity.noContent().build();
    }
}
