package com.backend.controller;

// src/main/java/com/example/researchbackendsimplified/controller/ResearchProjectController.java


import com.backend.model.ResearchProject;
import com.backend.service.ResearchProjectService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin("*")
public class ResearchProjectController {

    @Autowired
    private ResearchProjectService researchProjectService;

    @PostMapping
    public ResponseEntity<ResearchProject> createResearchProject(@Valid @RequestBody ResearchProject project) {
        ResearchProject createdProject = researchProjectService.createProject(project);
        return new ResponseEntity<>(createdProject, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResearchProject> getResearchProjectById(@PathVariable Long id) {
        ResearchProject project = researchProjectService.getProjectByIdOrThrow(id);
        return ResponseEntity.ok(project);
    }

    @GetMapping
    public ResponseEntity<List<ResearchProject>> getAllResearchProjects() {
        List<ResearchProject> projects = researchProjectService.getAllProjects();
        return ResponseEntity.ok(projects);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResearchProject> updateResearchProject(@PathVariable Long id, @Valid @RequestBody ResearchProject projectDetails) {
        ResearchProject updatedProject = researchProjectService.updateProject(id, projectDetails);
        return ResponseEntity.ok(updatedProject);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResearchProject(@PathVariable Long id) {
        researchProjectService.deleteProject(id);
        return ResponseEntity.noContent().build();
    }
}
