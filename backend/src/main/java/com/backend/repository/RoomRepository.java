package com.backend.repository;

// src/main/java/com/example/researchbackendsimplified/repository/RoomRepository.java


import com.backend.model.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {
    List<Room> findByLaboratoryId(Long laboratoryId);
    // Optional<Room> findByNameAndLaboratoryId(String name, Long laboratoryId); // If room name is unique within a lab
}
