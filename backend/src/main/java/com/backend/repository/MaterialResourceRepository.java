package com.backend.repository;

// src/main/java/com/example/researchbackendsimplified/repository/MaterialResourceRepository.java


import com.backend.model.MaterialResource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MaterialResourceRepository extends JpaRepository<MaterialResource, Long> {
    List<MaterialResource> findByRoomId(Long roomId);
    // List<MaterialResource> findByNameContainingIgnoreCase(String name); // Example for searching
}
