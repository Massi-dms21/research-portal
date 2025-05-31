package com.backend.controller;

// src/main/java/com/example/researchbackendsimplified/controller/UserController.java


import com.backend.model.Role;
import com.backend.model.User;
import com.backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin("*")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<User> createUser(@Valid @RequestBody User user) {
        // At this point, if the 'user' object from the request body has a non-null 'id',
        // and you pass it directly to userService.createUser, it might cause issues.
        System.out.println("BACKEND CTRL: createUser - Received user from request. ID: " + user.getId() + ", Username: " + user.getUsername());
        // Ensure the ID is null for new entities if it's being set by the client mistakenly
        if (user.getId() != null) {
            System.out.println("BACKEND CTRL: createUser - Client sent an ID for a new user. Setting ID to null.");
            user.setId(null); // Explicitly nullify ID for new user creation
        }
        User createdUser = userService.createUser(user);
        return new ResponseEntity<>(createdUser, HttpStatus.CREATED);}

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        User user = userService.getUserByIdOrThrow(id);
        return ResponseEntity.ok(user);
    }

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @Valid @RequestBody User userDetails) {
        User updatedUser = userService.updateUser(id, userDetails);
        return ResponseEntity.ok(updatedUser);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{userId}/team/{teamId}")
    public ResponseEntity<User> assignUserToTeam(@PathVariable Long userId, @PathVariable Long teamId) {
        User user = userService.assignUserToTeam(userId, teamId);
        return ResponseEntity.ok(user);
    }

    @DeleteMapping("/{userId}/team") // Or @PutMapping("/{userId}/team/remove")
    public ResponseEntity<User> removeUserFromTeam(@PathVariable Long userId) {
        User user = userService.removeUserFromTeam(userId);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/{userId}/role")
    public ResponseEntity<User> changeUserRole(@PathVariable Long userId, @RequestParam Role newRole) {
        User user = userService.changeUserRole(userId, newRole);
        return ResponseEntity.ok(user);
    }

    // Simplified login - NOT SECURE, for demonstration only
    @GetMapping("/login")
    public ResponseEntity<User> login(@RequestParam String username, @RequestParam String password) {
        Optional<User> userOptional = userService.login(username, password);
        return userOptional.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
    }
}
