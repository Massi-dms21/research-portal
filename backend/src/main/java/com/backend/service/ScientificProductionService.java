package com.backend.service;

// src/main/java/com/example/researchbackendsimplified/service/ScientificProductionService.java


import com.backend.exception.ResourceNotFoundException;
import com.backend.model.ResearchProject;
import com.backend.model.ScientificProduction;
import com.backend.model.User;
import com.backend.repository.ResearchProjectRepository;
import com.backend.repository.ScientificProductionRepository; // Assuming this exists
import com.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@Service
public class ScientificProductionService {

    private static final String PRODUCTION_FILES_SUBDIR = "productions";

    @Autowired
    private ScientificProductionRepository scientificProductionRepository;

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private UserRepository userRepository; // To assign author

    @Autowired
    private ResearchProjectRepository researchProjectRepository; // To link project

    @Transactional
    public ScientificProduction createProduction(ScientificProduction production, Long authorId, Long researchProjectId, MultipartFile file) {
        User author = userRepository.findById(authorId)
                .orElseThrow(() -> new ResourceNotFoundException("Author (User)", "id", authorId));
        production.setAuthor(author);

        if (researchProjectId != null) {
            ResearchProject project = researchProjectRepository.findById(researchProjectId)
                    .orElseThrow(() -> new ResourceNotFoundException("ResearchProject", "id", researchProjectId));
            production.setResearchProject(project);
        }

        if (file != null && !file.isEmpty()) {
            String filePath = fileStorageService.storeFile(file, PRODUCTION_FILES_SUBDIR);
            production.setFilePath(filePath);
            production.setOriginalFileName(file.getOriginalFilename());
            production.setContentType(file.getContentType());
            production.setFileSize(file.getSize());
        }
        return scientificProductionRepository.save(production);
    }

    public Optional<ScientificProduction> getProductionById(Long id) {
        return scientificProductionRepository.findById(id);
    }
    public ScientificProduction getProductionByIdOrThrow(Long id) {
        return scientificProductionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ScientificProduction", "id", id));
    }

    public List<ScientificProduction> getAllProductions() {
        return scientificProductionRepository.findAll();
    }

    public List<ScientificProduction> getProductionsByAuthorId(Long authorId) {
        // Requires findByAuthorId method in ScientificProductionRepository
        return scientificProductionRepository.findByAuthorId(authorId);
    }

    @Transactional
    public ScientificProduction updateProduction(Long id, ScientificProduction productionDetails, Long researchProjectId, MultipartFile file) {
        ScientificProduction existingProduction = getProductionByIdOrThrow(id);

        existingProduction.setTitle(productionDetails.getTitle());
        existingProduction.setAbstractText(productionDetails.getAbstractText());
        existingProduction.setType(productionDetails.getType());
        existingProduction.setPublicationDate(productionDetails.getPublicationDate());

        if (researchProjectId != null) {
            ResearchProject project = researchProjectRepository.findById(researchProjectId)
                    .orElseThrow(() -> new ResourceNotFoundException("ResearchProject", "id", researchProjectId));
            existingProduction.setResearchProject(project);
        } else {
            existingProduction.setResearchProject(null);
        }

        if (file != null && !file.isEmpty()) {
            // Delete old file if it exists
            if (existingProduction.getFilePath() != null) {
                fileStorageService.deleteFile(existingProduction.getFilePath());
            }
            // Store new file
            String filePath = fileStorageService.storeFile(file, PRODUCTION_FILES_SUBDIR);
            existingProduction.setFilePath(filePath);
            existingProduction.setOriginalFileName(file.getOriginalFilename());
            existingProduction.setContentType(file.getContentType());
            existingProduction.setFileSize(file.getSize());
        }
        return scientificProductionRepository.save(existingProduction);
    }

    @Transactional
    public void deleteProduction(Long id) {
        ScientificProduction production = getProductionByIdOrThrow(id);
        if (production.getFilePath() != null) {
            fileStorageService.deleteFile(production.getFilePath());
        }
        scientificProductionRepository.deleteById(id);
    }
}
