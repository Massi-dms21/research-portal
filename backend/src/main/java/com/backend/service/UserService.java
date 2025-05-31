package com.backend.service;

// src/main/java/com/example/researchbackendsimplified/service/UserService.java


import com.backend.exception.ResourceNotFoundException;
import com.backend.model.Role;
import com.backend.model.Team;
import com.backend.model.User;
import com.backend.repository.TeamRepository; // Assuming this exists
import com.backend.repository.UserRepository; // Assuming this exists
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository; // We'll define this later

    @Autowired
    private TeamRepository teamRepository; // We'll define this later

    // In backend com.backend.service.UserService.java

    public User createUser(User user) { // User object from controller will not have role set by frontend
        // Add validation if username/email already exists
        if (userRepository.existsByUsername(user.getUsername())) {
            // Consider throwing a specific exception here that GlobalExceptionHandler can handle
            // For now, simple error message, or rely on DB constraint if unique=true
            System.err.println("Error: Username is already taken! " + user.getUsername());
            throw new RuntimeException("Error: Username is already taken!"); // Or a custom exception
        }
        if (userRepository.existsByEmail(user.getEmail())) {
            System.err.println("Error: Email is already in use! " + user.getEmail());
            throw new RuntimeException("Error: Email is already in use!"); // Or a custom exception
        }
        if (user.getId() != null) user.setId(null);
        if(user.getRole() != Role.USER){
            user.setRole(user.getRole());
        }else{
            user.setRole(Role.USER); // <--- SET ROLE TO USER BY DEFAULT

        }


        // In a real app, encode password here:
        // user.setPassword(passwordEncoder.encode(user.getPassword()));
        System.out.println("BACKEND SVC: Creating user '" + user.getUsername() + "' with default role USER.");
        return userRepository.save(user);
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public User getUserByIdOrThrow(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
    }

    public Optional<User> getUserByUsername(String username) {
        return userRepository.findByUsername(username); // Assumes findByUsername exists in UserRepository
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Transactional
    public User updateUser(Long id, User userDetails) {
        User existingUser = getUserByIdOrThrow(id);
        existingUser.setId(id);
        existingUser.setUsername(userDetails.getUsername());
        existingUser.setEmail(userDetails.getEmail());
        existingUser.setFirstName(userDetails.getFirstName());
        existingUser.setLastName(userDetails.getLastName());
        existingUser.setPassword(userDetails.getPassword());

        // Role and Team changes might be handled by specific methods for clarity/security
         existingUser.setRole(userDetails.getRole());
        // existingUser.setTeam(userDetails.getTeam());
        return userRepository.save(existingUser);
    }

    @Transactional
    public void deleteUser(Long id) {
        User user = getUserByIdOrThrow(id);
        // Add logic: if user is a team lead, nullify teamLead in Team or reassign
        if (user.getTeam() != null && user.getTeam().getTeamLead() != null && user.getTeam().getTeamLead().getId().equals(id)) {
            Team team = user.getTeam();
            team.setTeamLead(null);
            teamRepository.save(team);
        }
        userRepository.deleteById(id);
    }

    @Transactional
    public User assignUserToTeam(Long userId, Long teamId) {
        User user = getUserByIdOrThrow(userId);
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new ResourceNotFoundException("Team", "id", teamId));
        user.setTeam(team);
        // team.getMembers().add(user); // This side is managed by User.setTeam due to mappedBy
        return userRepository.save(user);
    }

    @Transactional
    public User removeUserFromTeam(Long userId) {
        User user = getUserByIdOrThrow(userId);
        // Team team = user.getTeam();
        // if (team != null) {
        //     team.getMembers().remove(user); // This side is managed by User.setTeam
        //     teamRepository.save(team);
        // }
        user.setTeam(null);
        return userRepository.save(user);
    }

    @Transactional
    public User changeUserRole(Long userId, Role newRole) {
        User user = getUserByIdOrThrow(userId);
        user.setRole(newRole);
        return userRepository.save(user);
    }

    // Method for "login" - extremely simplified without security
    public Optional<User> login(String username, String password) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isPresent() && userOpt.get().getPassword().equals(password)) { // Plain text password check!
            return userOpt;
        }
        return Optional.empty();
    }
}
