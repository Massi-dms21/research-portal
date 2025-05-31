package com.backend.service;

// src/main/java/com/example/researchbackendsimplified/service/MaterialResourceService.java


import com.backend.exception.ResourceNotFoundException;
import com.backend.model.MaterialResource;
import com.backend.model.Room;
import com.backend.repository.MaterialResourceRepository; // Assuming this exists
import com.backend.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class MaterialResourceService {

    @Autowired
    private MaterialResourceRepository materialResourceRepository;

    @Autowired
    private RoomRepository roomRepository; // To link resource to room

    @Transactional
    public MaterialResource createMaterialResource(MaterialResource resource, Long roomId) {
        if (roomId != null) {
            Room room = roomRepository.findById(roomId)
                    .orElseThrow(() -> new ResourceNotFoundException("Room", "id", roomId));
            resource.setRoom(room);
        }
        return materialResourceRepository.save(resource);
    }

    public Optional<MaterialResource> getMaterialResourceById(Long id) {
        return materialResourceRepository.findById(id);
    }
    public MaterialResource getMaterialResourceByIdOrThrow(Long id) {
        return materialResourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("MaterialResource", "id", id));
    }

    public List<MaterialResource> getAllMaterialResources() {
        return materialResourceRepository.findAll();
    }

    @Transactional
    public MaterialResource updateMaterialResource(Long id, MaterialResource resourceDetails, Long roomId) {
        MaterialResource existingResource = getMaterialResourceByIdOrThrow(id);
        existingResource.setName(resourceDetails.getName());
        existingResource.setDescription(resourceDetails.getDescription());
        existingResource.setQuantity(resourceDetails.getQuantity());

        if (roomId != null) {
            Room room = roomRepository.findById(roomId)
                    .orElseThrow(() -> new ResourceNotFoundException("Room", "id", roomId));
            existingResource.setRoom(room);
        } else {
            existingResource.setRoom(null);
        }
        return materialResourceRepository.save(existingResource);
    }

    @Transactional
    public void deleteMaterialResource(Long id) {
        // Check if resource exists before deleting
        if (!materialResourceRepository.existsById(id)) {
            throw new ResourceNotFoundException("MaterialResource", "id", id);
        }
        materialResourceRepository.deleteById(id);
    }
}
