package com.finpath.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "opportunities")
public class Opportunity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private OpportunityCategory category;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "target_customer", nullable = false)
    private String targetCustomer;

    @Column(name = "potential_solution", nullable = false, columnDefinition = "TEXT")
    private String potentialSolution;

    @Column(name = "required_skills", nullable = false, columnDefinition = "TEXT")
    private String requiredSkills;

    @Column(name = "initial_cost_min", nullable = false)
    private BigDecimal initialCostMin = BigDecimal.ZERO;

    @Column(name = "initial_cost_max", nullable = false)
    private BigDecimal initialCostMax = BigDecimal.ZERO;

    @Column(name = "pricing_model")
    private String pricingModel;

    @Column(name = "competition_notes", columnDefinition = "TEXT")
    private String competitionNotes;

    @Column(nullable = false)
    private String difficulty = "MEDIUM"; // EASY, MEDIUM, HARD

    @Column(name = "time_commitment")
    private String timeCommitment;

    @Column(name = "business_model")
    private String businessModel;

    @Column(name = "validation_status", nullable = false)
    private String validationStatus = "NOT_STARTED"; // NOT_STARTED, RESEARCHING, INTERVIEWING, PROBLEM_CONFIRMED, WILLINGNESS_TO_PAY_TESTED, READY_TO_BUILD, REJECTED

    @Column(name = "base_fit_score", nullable = false)
    private Integer baseFitScore = 75;

    @Column(name = "is_featured", nullable = false)
    private Boolean isFeatured = false;

    @Column(name = "is_user_submitted", nullable = false)
    private Boolean isUserSubmitted = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by_user_id")
    private User createdByUser;

    @Column(name = "is_approved", nullable = false)
    private Boolean isApproved = true;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();

    public Opportunity() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public OpportunityCategory getCategory() { return category; }
    public void setCategory(OpportunityCategory category) { this.category = category; }

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

    public Boolean getIsFeatured() { return isFeatured; }
    public void setIsFeatured(Boolean isFeatured) { this.isFeatured = isFeatured; }

    public Boolean getIsUserSubmitted() { return isUserSubmitted; }
    public void setIsUserSubmitted(Boolean isUserSubmitted) { this.isUserSubmitted = isUserSubmitted; }

    public User getCreatedByUser() { return createdByUser; }
    public void setCreatedByUser(User createdByUser) { this.createdByUser = createdByUser; }

    public Boolean getIsApproved() { return isApproved; }
    public void setIsApproved(Boolean isApproved) { this.isApproved = isApproved; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    @PreUpdate
    public void onUpdate() { this.updatedAt = LocalDateTime.now(); }
}
