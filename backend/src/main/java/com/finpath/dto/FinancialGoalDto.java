package com.finpath.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class FinancialGoalDto {
    private Long id;
    private String goalType;
    private String title;
    private BigDecimal targetAmount;
    private BigDecimal currentAllocated;
    private LocalDate deadline;
    private String priority;
    private String currency;
    private String status;
    private BigDecimal progressPercentage;
    private BigDecimal remainingGap;
    private BigDecimal requiredMonthlyContribution;
    private Long monthsRemaining;

    public FinancialGoalDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getGoalType() { return goalType; }
    public void setGoalType(String goalType) { this.goalType = goalType; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public BigDecimal getTargetAmount() { return targetAmount; }
    public void setTargetAmount(BigDecimal targetAmount) { this.targetAmount = targetAmount; }

    public BigDecimal getCurrentAllocated() { return currentAllocated; }
    public void setCurrentAllocated(BigDecimal currentAllocated) { this.currentAllocated = currentAllocated; }

    public LocalDate getDeadline() { return deadline; }
    public void setDeadline(LocalDate deadline) { this.deadline = deadline; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public BigDecimal getProgressPercentage() { return progressPercentage; }
    public void setProgressPercentage(BigDecimal progressPercentage) { this.progressPercentage = progressPercentage; }

    public BigDecimal getRemainingGap() { return remainingGap; }
    public void setRemainingGap(BigDecimal remainingGap) { this.remainingGap = remainingGap; }

    public BigDecimal getRequiredMonthlyContribution() { return requiredMonthlyContribution; }
    public void setRequiredMonthlyContribution(BigDecimal requiredMonthlyContribution) { this.requiredMonthlyContribution = requiredMonthlyContribution; }

    public Long getMonthsRemaining() { return monthsRemaining; }
    public void setMonthsRemaining(Long monthsRemaining) { this.monthsRemaining = monthsRemaining; }
}
