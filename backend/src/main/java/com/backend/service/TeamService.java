package com.backend.service;

// src/main/java/com/example/researchbackendsimplified/service/TeamService.java

import com.backend.exception.ResourceNotFoundException;
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
public class TeamService {

    @Autowired
    private TeamRepository teamRepository;

    @Autowired
    private UserRepository userRepository; // Or UserService

    public Team createTeam(Team team) {
        // Optionally ensure team name is unique
        return teamRepository.save(team);
    }

    public Optional<Team> getTeamById(Long id) {
        return teamRepository.findById(id);
    }
    public Team getTeamByIdOrThrow(Long id) {
        return teamRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Team", "id", id));
    }


    public List<Team> getAllTeams() {
        return teamRepository.findAll();
    }

    @Transactional
    public Team updateTeam(Long id, Team teamDetails) {
        Team existingTeam = getTeamByIdOrThrow(id);
        existingTeam.setName(teamDetails.getName());
        // Updating team lead or members might be separate operations
        return teamRepository.save(existingTeam);
    }

    @Transactional
    public void deleteTeam(Long id) {
        Team team = getTeamByIdOrThrow(id);
        // Nullify the team reference in all member users
        for (User member : team.getMembers()) {
            member.setTeam(null);
            userRepository.save(member);
        }
        teamRepository.deleteById(id);
    }

    @Transactional
    public Team assignTeamLead(Long teamId, Long userId) {
        Team team = getTeamByIdOrThrow(teamId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        // Potentially check if user is part of the team or has appropriate role
        team.setTeamLead(user);
        return teamRepository.save(team);
    }

    // addMemberToTeam and removeMemberFromTeam are effectively handled by UserService.assignUserToTeam/removeUserFromTeam
    // because the User entity holds the team_id foreign key.
    // If you need to manage the Team.members collection directly for some reason (e.g., bi-directional sync not done via User),
    // you would do it here, but it's usually simpler to manage the owning side of the @ManyToOne.
}