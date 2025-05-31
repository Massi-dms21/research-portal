package com.backend.repository;

// src/main/java/com/example/researchbackendsimplified/repository/LaboratoryRepository.java


import com.backend.model.Laboratory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LaboratoryRepository extends JpaRepository<Laboratory, Long> {
    Optional<Laboratory> findByName(String name); // If lab names should be unique
}
