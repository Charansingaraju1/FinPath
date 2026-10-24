package com.finpath.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_profiles")
public class UserProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "display_name")
    private String displayName;

    @Column(name = "age_range")
    private String ageRange;

    private String country;

    @Column(name = "state_region")
    private String stateRegion;

    @Column(name = "education_employment_status")
    private String educationEmploymentStatus;

    private String occupation;

    @Column(columnDefinition = "TEXT")
    private String skills;

    @Column(name = "experience_level")
    private String experienceLevel;

    @Column(columnDefinition = "TEXT")
    private String interests;

    @Column(name = "available_hours_per_week")
    private Integer availableHoursPerWeek = 10;

    @Column(name = "equipment_resources", columnDefinition = "TEXT")
    private String equipmentResources;

    @Column(name = "willingness_to_learn")
    private Boolean willingnessToLearn = true;

    @Column(name = "preferred_income_model")
    private String preferredIncomeModel;

    @Column(name = "onboarding_completed")
    private Boolean onboardingCompleted = false;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();

    public UserProfile() {}

    public UserProfile(User user) {
        this.user = user;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getDisplayName() { return displayName; }
    public void setDisplayName(String displayName) { this.displayName = displayName; }

    public String getAgeRange() { return ageRange; }
    public void setAgeRange(String ageRange) { this.ageRange = ageRange; }

    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }

    public String getStateRegion() { return stateRegion; }
    public void setStateRegion(String stateRegion) { this.stateRegion = stateRegion; }

    public String getEducationEmploymentStatus() { return educationEmploymentStatus; }
    public void setEducationEmploymentStatus(String educationEmploymentStatus) { this.educationEmploymentStatus = educationEmploymentStatus; }

    public String getOccupation() { return occupation; }
    public void setOccupation(String occupation) { this.occupation = occupation; }

    public String getSkills() { return skills; }
    public void setSkills(String skills) { this.skills = skills; }

    public String getExperienceLevel() { return experienceLevel; }
    public void setExperienceLevel(String experienceLevel) { this.experienceLevel = experienceLevel; }

    public String getInterests() { return interests; }
    public void setInterests(String interests) { this.interests = interests; }

    public Integer getAvailableHoursPerWeek() { return availableHoursPerWeek; }
    public void setAvailableHoursPerWeek(Integer availableHoursPerWeek) { this.availableHoursPerWeek = availableHoursPerWeek; }

    public String getEquipmentResources() { return equipmentResources; }
    public void setEquipmentResources(String equipmentResources) { this.equipmentResources = equipmentResources; }

    public Boolean getWillingnessToLearn() { return willingnessToLearn; }
    public void setWillingnessToLearn(Boolean willingnessToLearn) { this.willingnessToLearn = willingnessToLearn; }

    public String getPreferredIncomeModel() { return preferredIncomeModel; }
    public void setPreferredIncomeModel(String preferredIncomeModel) { this.preferredIncomeModel = preferredIncomeModel; }

    public Boolean getOnboardingCompleted() { return onboardingCompleted; }
    public void setOnboardingCompleted(Boolean onboardingCompleted) { this.onboardingCompleted = onboardingCompleted; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    @PreUpdate
    public void onUpdate() { this.updatedAt = LocalDateTime.now(); }
}
