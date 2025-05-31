package com.backend.model; // Your backend package

import com.fasterxml.jackson.annotation.JsonIgnore; // Import this!
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode; // Good for collections to avoid issues with Lombok
import lombok.NoArgsConstructor;
import lombok.ToString; // Good for collections

import java.util.HashSet;
import java.util.Set;


@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 50)
    @Column(unique = true)
    private String username;

    @NotBlank
    @Size(max = 120)
    private String password;

    @NotBlank
    @Size(max = 50)
    @Email
    @Column(unique = true)
    private String email;

    @Size(max = 50)
    private String firstName;

    @Size(max = 50)
    private String lastName;

    @Enumerated(EnumType.STRING)
    @Column(length = 20, nullable = false)
    private Role role;

    @ManyToOne(fetch = FetchType.LAZY) // Good: LAZY fetching
    @JoinColumn(name = "team_id")
    @JsonIgnore // <--- ADD THIS if Team also has a Set<User> members causing a cycle for the /api/users list
    @ToString.Exclude // Recommended with collections and bidirectional relationships
    @EqualsAndHashCode.Exclude // Recommended
    private Team team;

    @OneToMany(mappedBy = "author", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY) // Good: LAZY fetching
    @JsonIgnore // <--- ADD THIS to prevent sending all productions for every user in the list
    @ToString.Exclude // Recommended with collections and bidirectional relationships
    @EqualsAndHashCode.Exclude // Recommended
    private Set<ScientificProduction> scientificProductions = new HashSet<>();

    // If a User can be a team lead for only one team (as per @OneToOne in Team)

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public Team getTeam() {
        return team;
    }

    public void setTeam(Team team) {
        this.team = team;
    }

    public Set<ScientificProduction> getScientificProductions() {
        return scientificProductions;
    }

    public void setScientificProductions(Set<ScientificProduction> scientificProductions) {
        this.scientificProductions = scientificProductions;
    }
    // this side of the relationship is implied by Team.teamLead.
    // If a user could lead multiple teams, Team.teamLead would be @ManyToOne User teamLead
    // and here you'd have @OneToMany(mappedBy = "teamLead") Set<Team> ledTeams.
    // For simplicity, sticking to the current model where Team has one lead.
}
