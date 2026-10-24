package com.finpath.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class OpportunityDto {
    private Long id;
    private Long categoryId;
    private String categoryName;
    private String categoryIcon;
    private String title;
    private String description;
    private String targetCustomer;
    private String potentialSolution;
    private String requiredSkills;
    private BigDecimal initialCostMin;
    private BigDecimal initialCostMax;
    private String pricingModel;
    private String competitionNotes;
    private String difficulty;
    private String timeCommitment;
    private String businessModel;
    private String validationStatus;
    private Integer baseFitScore;
    private Integer userCalculatedFitScore;
    private Boolean isFeatured;
    private Boolean isUserSubmitted;
    private Boolean isSavedByCurrentUser;
    private Boolean isApproved;
    private LocalDateTime createdAt;

    public OpportunityDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }

    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }

    public String getCategoryIcon() { return categoryIcon; }
    public void setCategoryIcon(String categoryIcon) { this.categoryIcon = categoryIcon; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getTargetCustomer() { return targetCustomer; }
    public void setTargetCustomer(String targetCustomer) { this.targetCustomer = targetCustomer; }

    public String getPotentialSolution() { return potentialSolution; }
    public void setPotentialSolution(String potentialSolution) { this.potentialSolution = potentialSolution; }

    public String getRequiredSkills() { return requiredSkills; }
    public void setRequiredSkills(String requiredSkills) { this.requiredSkills = requiredSkills; }

    public BigDecimal getInitialCostMin() { return initialCostMin; }
    public void setInitialCostMin(BigDecimal initialCostMin) { this.initialCostMin = initialCostMin; }

    public BigDecimal getInitialCostMax() { return initialCostMax; }
    public void setInitialCostMax(BigDecimal initialCostMax) { this.initialCostMax = initialCostMax; }

    public String getPricingModel() { return pricingModel; }
    public void setPricingModel(String pricingModel) { this.pricingModel = pricingModel; }

    public String getCompetitionNotes() { return competitionNotes; }
    public void setCompetitionNotes(String competitionNotes) { this.competitionNotes = competitionNotes; }

    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }

    public String getTimeCommitment() { return timeCommitment; }
    public void setTimeCommitment(String timeCommitment) { this.timeCommitment = timeCommitment; }

    public String getBusinessModel() { return businessModel; }
    public void setBusinessModel(String businessModel) { this.businessModel = businessModel; }

    public String getValidationStatus() { return validationStatus; }
    public void setValidationStatus(String validationStatus) { this.validationStatus = validationStatus; }

    public Integer getBaseFitScore() { return baseFitScore; }
    public void setBaseFitScore(Integer baseFitScore) { this.baseFitScore = baseFitScore; }

    public Integer getUserCalculatedFitScore() { return userCalculatedFitScore; }
    public void setUserCalculatedFitScore(Integer userCalculatedFitScore) { this.userCalculatedFitScore = userCalculatedFitScore; }

    public Boolean getIsFeatured() { return isFeatured; }
    public void setIsFeatured(Boolean isFeatured) { this.isFeatured = isFeatured; }

    public Boolean getIsUserSubmitted() { return isUserSubmitted; }
    public void setIsUserSubmitted(Boolean isUserSubmitted) { this.isUserSubmitted = isUserSubmitted; }

    public Boolean getIsSavedByCurrentUser() { return isSavedByCurrentUser; }
    public void setIsSavedByCurrentUser(Boolean isSavedByCurrentUser) { this.isSavedByCurrentUser = isSavedByCurrentUser; }

    public Boolean getIsApproved() { return isApproved; }
    public void setIsApproved(Boolean isApproved) { this.isApproved = isApproved; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
