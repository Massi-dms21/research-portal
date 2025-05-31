package com.backend.service;

// src/main/java/com/example/researchbackendsimplified/service/RoomService.java


import com.backend.exception.ResourceNotFoundException;
import com.backend.model.Laboratory;
import com.backend.model.Room;
import com.backend.repository.LaboratoryRepository;
import com.backend.repository.MaterialResourceRepository;
import com.backend.repository.RoomRepository; // Assuming this exists
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class RoomService {

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private LaboratoryRepository laboratoryRepository; // To link room to lab

    @Autowired
    private MaterialResourceRepository materialResourceRepository; // If deleting room affects resources

    @Transactional
    public Room createRoom(Room room, Long laboratoryId) {
        if (laboratoryId != null) {
            Laboratory lab = laboratoryRepository.findById(laboratoryId)
                    .orElseThrow(() -> new ResourceNotFoundException("Laboratory", "id", laboratoryId));
            room.setLaboratory(lab);
        }
        return roomRepository.save(room);
    }

    public Optional<Room> getRoomById(Long id) {
        return roomRepository.findById(id);
    }
    public Room getRoomByIdOrThrow(Long id) {
        return roomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room", "id", id));
    }

    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    @Transactional
    public Room updateRoom(Long id, Room roomDetails, Long laboratoryId) {
        Room existingRoom = getRoomByIdOrThrow(id);
        existingRoom.setName(roomDetails.getName());
        existingRoom.setCapacity(roomDetails.getCapacity());

        if (laboratoryId != null) {
            Laboratory lab = laboratoryRepository.findById(laboratoryId)
                    .orElseThrow(() -> new ResourceNotFoundException("Laboratory", "id", laboratoryId));
            existingRoom.setLaboratory(lab);
        } else {
            existingRoom.setLaboratory(null);
        }
        return roomRepository.save(existingRoom);
    }

    @Transactional
    public void deleteRoom(Long id) {
        Room room = getRoomByIdOrThrow(id);
        // If MaterialResources are tied to a Room and should be deleted (CascadeType.ALL in Room for resources)
        // then roomRepository.deleteById(id) is enough.
        // If resources should be orphaned (their room_id set to null), then:
        // room.getMaterialResources().forEach(res -> {
        //    res.setRoom(null);
        //    materialResourceRepository.save(res);
        // });
        // For CascadeType.ALL on Room.materialResources, this manual step is not needed for deletion.
        roomRepository.deleteById(id);
    }
}
