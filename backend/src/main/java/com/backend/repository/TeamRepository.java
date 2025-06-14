package com.backend.repository;

// src/main/java/com/example/researchbackendsimplified/repository/TeamRepository.java


import com.backend.model.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TeamRepository extends JpaRepository<Team, Long> {
    Optional<Team> findByName(String name); // If team names should be unique
}