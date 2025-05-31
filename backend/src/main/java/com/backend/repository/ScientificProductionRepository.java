package com.backend.repository;

// src/main/java/com/example/researchbackendsimplified/repository/ScientificProductionRepository.java


import com.backend.model.ScientificProduction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ScientificProductionRepository extends JpaRepository<ScientificProduction, Long> {
    List<ScientificProduction> findByAuthorId(Long authorId);
    List<ScientificProduction> findByResearchProjectId(Long researchProjectId);
    // You could add more specific finders, e.g., findByType, findByPublicationDateBetween, etc.
}
