package com.finpath.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class OpportunitySubmissionRequest {
    private Long categoryId;

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description of the problem is required")
    private String description;

    @NotBlank(message = "Target customer is required")
    private String targetCustomer;

    @NotBlank(message = "Potential solution is required")
    private String potentialSolution;

    @NotBlank(message = "Required skills are required")
    private String requiredSkills;

    private BigDecimal initialCostMin = BigDecimal.ZERO;
    private BigDecimal initialCostMax = BigDecimal.ZERO;
    private String pricingModel;
    private String difficulty = "MEDIUM";
    private String timeCommitment;
    private String businessModel;

    public OpportunitySubmissionRequest() {}

    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }

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

    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }

    public String getTimeCommitment() { return timeCommitment; }
    public void setTimeCommitment(String timeCommitment) { this.timeCommitment = timeCommitment; }

    public String getBusinessModel() { return businessModel; }
    public void setBusinessModel(String businessModel) { this.businessModel = businessModel; }
}
