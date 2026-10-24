package com.finpath.dto;

import java.math.BigDecimal;
import java.util.List;

public class GoalAssessmentDto {
    private String status; // ACHIEVABLE, POTENTIALLY_ACHIEVABLE, UNLIKELY, NOT_ASSESSABLE
    private String statusLabel;
    private String explanation;
    private BigDecimal monthlySurplus;
    private BigDecimal requiredMonthlyContribution;
    private BigDecimal monthlyShortfallOrSurplus;
    private Long monthsRemaining;
    private BigDecimal remainingGap;
    private List<String> actionableRecommendations;
    private List<String> assumptions;

    public GoalAssessmentDto() {}

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getStatusLabel() { return statusLabel; }
    public void setStatusLabel(String statusLabel) { this.statusLabel = statusLabel; }

    public String getExplanation() { return explanation; }
    public void setExplanation(String explanation) { this.explanation = explanation; }

    public BigDecimal getMonthlySurplus() { return monthlySurplus; }
    public void setMonthlySurplus(BigDecimal monthlySurplus) { this.monthlySurplus = monthlySurplus; }

    public BigDecimal getRequiredMonthlyContribution() { return requiredMonthlyContribution; }
    public void setRequiredMonthlyContribution(BigDecimal requiredMonthlyContribution) { this.requiredMonthlyContribution = requiredMonthlyContribution; }

    public BigDecimal getMonthlyShortfallOrSurplus() { return monthlyShortfallOrSurplus; }
    public void setMonthlyShortfallOrSurplus(BigDecimal monthlyShortfallOrSurplus) { this.monthlyShortfallOrSurplus = monthlyShortfallOrSurplus; }

    public Long getMonthsRemaining() { return monthsRemaining; }
    public void setMonthsRemaining(Long monthsRemaining) { this.monthsRemaining = monthsRemaining; }

    public BigDecimal getRemainingGap() { return remainingGap; }
    public void setRemainingGap(BigDecimal remainingGap) { this.remainingGap = remainingGap; }

    public List<String> getActionableRecommendations() { return actionableRecommendations; }
    public void setActionableRecommendations(List<String> actionableRecommendations) { this.actionableRecommendations = actionableRecommendations; }

    public List<String> getAssumptions() { return assumptions; }
    public void setAssumptions(List<String> assumptions) { this.assumptions = assumptions; }
}
