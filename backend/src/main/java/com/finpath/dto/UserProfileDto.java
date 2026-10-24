package com.finpath.dto;

public class UserProfileDto {
    private String displayName;
    private String ageRange;
    private String country;
    private String stateRegion;
    private String educationEmploymentStatus;
    private String occupation;
    private String skills;
    private String experienceLevel;
    private String interests;
    private Integer availableHoursPerWeek;
    private String equipmentResources;
    private Boolean willingnessToLearn;
    private String preferredIncomeModel;
    private Boolean onboardingCompleted;

    public UserProfileDto() {}

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
}
