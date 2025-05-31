package com.backend.controller;

// src/main/java/com/example/researchbackendsimplified/controller/MaterialResourceController.java


import com.backend.model.MaterialResource;
import com.backend.service.MaterialResourceService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resources")
@CrossOrigin("*")
public class MaterialResourceController {

    @Autowired
    private MaterialResourceService materialResourceService;

    @PostMapping
    public ResponseEntity<MaterialResource> createMaterialResource(
            @Valid @RequestBody MaterialResource resource,
            @RequestParam(required = false) Long roomId) {
        MaterialResource createdResource = materialResourceService.createMaterialResource(resource, roomId);
        return new ResponseEntity<>(createdResource, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MaterialResource> getMaterialResourceById(@PathVariable Long id) {
        MaterialResource resource = materialResourceService.getMaterialResourceByIdOrThrow(id);
        return ResponseEntity.ok(resource);
    }

    @GetMapping
    public ResponseEntity<List<MaterialResource>> getAllMaterialResources() {
        List<MaterialResource> resources = materialResourceService.getAllMaterialResources();
        return ResponseEntity.ok(resources);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MaterialResource> updateMaterialResource(
            @PathVariable Long id,
            @Valid @RequestBody MaterialResource resourceDetails,
            @RequestParam(required = false) Long roomId) {
        MaterialResource updatedResource = materialResourceService.updateMaterialResource(id, resourceDetails, roomId);
        return ResponseEntity.ok(updatedResource);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMaterialResource(@PathVariable Long id) {
        materialResourceService.deleteMaterialResource(id);
        return ResponseEntity.noContent().build();
    }
}
