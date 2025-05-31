package com.backend.model;

// src/main/java/com/example/researchbackendsimplified/model/ResearchProject.java


import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

import static jakarta.persistence.CascadeType.*;

@Entity
@Table(name = "research_projects")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResearchProject {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 200)
    private String title;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String description;

    private LocalDate startDate;
    private LocalDate endDate;

    // A project might have multiple scientific productions associated with it.
    @OneToMany(mappedBy = "researchProject", fetch = FetchType.LAZY, orphanRemoval = false)
    // CascadeType.SET_NULL means if project is deleted, the foreign key in ScientificProduction becomes null.
    // orphanRemoval=false ensures deleting project doesn't delete productions.
    @ToString.Exclude // Good practice for bidirectional relationships
    @EqualsAndHashCode.Exclude // Good practice for bidirectional relationships
    private Set<ScientificProduction> scientificProductions = new HashSet<>();

    // Consider if a project has a manager (User).
    // @ManyToOne(fetch = FetchType.LAZY)
    // @JoinColumn(name = "manager_id")
    // private User projectManager;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public Set<ScientificProduction> getScientificProductions() {
        return scientificProductions;
    }

    public void setScientificProductions(Set<ScientificProduction> scientificProductions) {
        this.scientificProductions = scientificProductions;
    }
}
