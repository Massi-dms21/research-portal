package com.backend.repository;

// src/main/java/com/example/researchbackendsimplified/repository/ResearchProjectRepository.java


import com.backend.model.ResearchProject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ResearchProjectRepository extends JpaRepository<ResearchProject, Long> {
    Optional<ResearchProject> findByTitle(String title); // If project titles should be unique
}
