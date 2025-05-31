package com.backend.service;

// src/main/java/com/example/researchbackendsimplified/service/LaboratoryService.java


import com.backend.exception.ResourceNotFoundException;
import com.backend.model.Laboratory;
import com.backend.repository.LaboratoryRepository; // Assuming this exists
import com.backend.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class LaboratoryService {

    @Autowired
    private LaboratoryRepository laboratoryRepository;

    @Autowired
    private RoomRepository roomRepository; // Needed if deleting lab should orphan rooms or delete them

    public Laboratory createLaboratory(Laboratory laboratory) {
        return laboratoryRepository.save(laboratory);
    }

    public Optional<Laboratory> getLaboratoryById(Long id) {
        return laboratoryRepository.findById(id);
    }
    public Laboratory getLaboratoryByIdOrThrow(Long id) {
        return laboratoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Laboratory", "id", id));
    }


    public List<Laboratory> getAllLaboratories() {
        return laboratoryRepository.findAll();
    }

    @Transactional
    public Laboratory updateLaboratory(Long id, Laboratory laboratoryDetails) {
        Laboratory existingLaboratory = getLaboratoryByIdOrThrow(id);
        existingLaboratory.setName(laboratoryDetails.getName());
        existingLaboratory.setLocation(laboratoryDetails.getLocation());
        existingLaboratory.setDescription(laboratoryDetails.getDescription());
        return laboratoryRepository.save(existingLaboratory);
    }

    @Transactional
    public void deleteLaboratory(Long id) {
        Laboratory lab = getLaboratoryByIdOrThrow(id);
        // If rooms are tied to a lab and should be deleted with it (CascadeType.ALL in Lab model for rooms)
        // then labRepository.deleteById(id) is enough.
        // If rooms should be orphaned (their lab_id set to null), then:
        // lab.getRooms().forEach(room -> {
        //    room.setLaboratory(null);
        //    roomRepository.save(room);
        // });
        // For CascadeType.ALL on Laboratory.rooms, this manual step is not needed for deletion of rooms.
        laboratoryRepository.deleteById(id);
    }
}
