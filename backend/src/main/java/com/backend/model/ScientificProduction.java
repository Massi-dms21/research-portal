package com.backend.model; // Your backend package

import com.fasterxml.jackson.annotation.JsonIgnoreProperties; // Import this
// Or if you prefer full ignore for list views:
// import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode; // Good practice
import lombok.NoArgsConstructor;
import lombok.ToString; // Good practice

import java.time.LocalDate;

@Entity
@Table(name = "scientific_productions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ScientificProduction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 255)
    private String title;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String abstractText;

    @NotBlank
    @Size(max = 50)
    private String type;

    @NotNull
    private LocalDate publicationDate;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "author_id", nullable = false)
    // This tells Jackson: when serializing 'author', if 'User' object has these fields, ignore them
    // to prevent User -> Set<ScientificProduction> part of the cycle.
    @JsonIgnoreProperties({"scientificProductions", "team", "password"}) // "password" is good to ignore generally
    @ToString.Exclude // Important for Lombok if User also refers back
    @EqualsAndHashCode.Exclude // Important for Lombok
    private User author;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "research_project_id")
    // This tells Jackson: when serializing 'researchProject', ignore its own list of productions.
    @JsonIgnoreProperties({"scientificProductions"})
    @ToString.Exclude // Important for Lombok if ResearchProject also refers back
    @EqualsAndHashCode.Exclude // Important for Lombok
    private ResearchProject researchProject;

    // File metadata
    private String filePath;
    private String originalFileName;
    private String contentType;
    private Long fileSize;

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

    public String getAbstractText() {
        return abstractText;
    }

    public void setAbstractText(String abstractText) {
        this.abstractText = abstractText;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public LocalDate getPublicationDate() {
        return publicationDate;
    }

    public void setPublicationDate(LocalDate publicationDate) {
        this.publicationDate = publicationDate;
    }

    public User getAuthor() {
        return author;
    }

    public void setAuthor(User author) {
        this.author = author;
    }

    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

    public String getOriginalFileName() {
        return originalFileName;
    }

    public void setOriginalFileName(String originalFileName) {
        this.originalFileName = originalFileName;
    }

    public String getContentType() {
        return contentType;
    }

    public void setContentType(String contentType) {
        this.contentType = contentType;
    }

    public Long getFileSize() {
        return fileSize;
    }

    public void setFileSize(Long fileSize) {
        this.fileSize = fileSize;
    }

    public ResearchProject getResearchProject() {
        return researchProject;
    }

    public void setResearchProject(ResearchProject researchProject) {
        this.researchProject = researchProject;
    }
}
