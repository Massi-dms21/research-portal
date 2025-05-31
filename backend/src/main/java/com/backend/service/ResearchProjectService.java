package com.backend.service;

// src/main/java/com/example/researchbackendsimplified/service/ResearchProjectService.java


import com.backend.exception.ResourceNotFoundException;
import com.backend.model.ResearchProject;
import com.backend.model.ScientificProduction;
import com.backend.repository.ResearchProjectRepository; // Assuming this exists
import com.backend.repository.ScientificProductionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class ResearchProjectService {

    @Autowired
    private ResearchProjectRepository researchProjectRepository;

    @Autowired
    private ScientificProductionRepository scientificProductionRepository; // For cascading SET NULL

    public ResearchProject createProject(ResearchProject project) {
        return researchProjectRepository.save(project);
    }

    public Optional<ResearchProject> getProjectById(Long id) {
        return researchProjectRepository.findById(id);
    }
    public ResearchProject getProjectByIdOrThrow(Long id) {
        return researchProjectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ResearchProject", "id", id));
    }

    public List<ResearchProject> getAllProjects() {
        return researchProjectRepository.findAll();
    }

    @Transactional
    public ResearchProject updateProject(Long id, ResearchProject projectDetails) {
        ResearchProject existingProject = getProjectByIdOrThrow(id);
        existingProject.setTitle(projectDetails.getTitle());
        existingProject.setDescription(projectDetails.getDescription());
        existingProject.setStartDate(projectDetails.getStartDate());
        existingProject.setEndDate(projectDetails.getEndDate());
        return researchProjectRepository.save(existingProject);
    }

    @Transactional
    public void deleteProject(Long id) {
        ResearchProject project = getProjectByIdOrThrow(id);


        researchProjectRepository.deleteById(id);
    }
}
