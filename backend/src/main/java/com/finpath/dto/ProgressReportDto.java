package com.finpath.dto;

import java.math.BigDecimal;
import java.util.List;

public class ProgressReportDto {
    private BigDecimal goalCompletionPercentage;
    private BigDecimal targetGoalAmount;
    private BigDecimal currentGoalAllocated;
    private BigDecimal plannedSavings;
    private BigDecimal actualSavings;
    private BigDecimal savingsVariance;
    private Integer totalRoadmapTasks;
    private Integer completedRoadmapTasks;
    private BigDecimal taskCompletionPercentage;
    private Integer customerInterviewsCompleted;
    private Integer opportunitiesValidatedCount;
    private Integer actualPayingCustomersCount;
    private BigDecimal actualBusinessRevenue;
    private BigDecimal actualBusinessCosts;
    private BigDecimal actualNetBusinessProfit;
    private List<RoadmapTaskDto> upcomingMilestones;
    private List<DailyActionDto> todayActions;
    private String pacingStatus; // ON_TRACK, SLIGHTLY_BEHIND, OFF_TRACK, AHEAD
    private List<String> strategicRecommendations;

    public ProgressReportDto() {}

    public BigDecimal getGoalCompletionPercentage() { return goalCompletionPercentage; }
    public void setGoalCompletionPercentage(BigDecimal goalCompletionPercentage) { this.goalCompletionPercentage = goalCompletionPercentage; }

    public BigDecimal getTargetGoalAmount() { return targetGoalAmount; }
    public void setTargetGoalAmount(BigDecimal targetGoalAmount) { this.targetGoalAmount = targetGoalAmount; }

    public BigDecimal getCurrentGoalAllocated() { return currentGoalAllocated; }
    public void setCurrentGoalAllocated(BigDecimal currentGoalAllocated) { this.currentGoalAllocated = currentGoalAllocated; }

    public BigDecimal getPlannedSavings() { return plannedSavings; }
    public void setPlannedSavings(BigDecimal plannedSavings) { this.plannedSavings = plannedSavings; }

    public BigDecimal getActualSavings() { return actualSavings; }
    public void setActualSavings(BigDecimal actualSavings) { this.actualSavings = actualSavings; }

    public BigDecimal getSavingsVariance() { return savingsVariance; }
    public void setSavingsVariance(BigDecimal savingsVariance) { this.savingsVariance = savingsVariance; }

    public Integer getTotalRoadmapTasks() { return totalRoadmapTasks; }
    public void setTotalRoadmapTasks(Integer totalRoadmapTasks) { this.totalRoadmapTasks = totalRoadmapTasks; }

    public Integer getCompletedRoadmapTasks() { return completedRoadmapTasks; }
    public void setCompletedRoadmapTasks(Integer completedRoadmapTasks) { this.completedRoadmapTasks = completedRoadmapTasks; }

    public BigDecimal getTaskCompletionPercentage() { return taskCompletionPercentage; }
    public void setTaskCompletionPercentage(BigDecimal taskCompletionPercentage) { this.taskCompletionPercentage = taskCompletionPercentage; }

    public Integer getCustomerInterviewsCompleted() { return customerInterviewsCompleted; }
    public void setCustomerInterviewsCompleted(Integer customerInterviewsCompleted) { this.customerInterviewsCompleted = customerInterviewsCompleted; }

    public Integer getOpportunitiesValidatedCount() { return opportunitiesValidatedCount; }
    public void setOpportunitiesValidatedCount(Integer opportunitiesValidatedCount) { this.opportunitiesValidatedCount = opportunitiesValidatedCount; }

    public Integer getActualPayingCustomersCount() { return actualPayingCustomersCount; }
    public void setActualPayingCustomersCount(Integer actualPayingCustomersCount) { this.actualPayingCustomersCount = actualPayingCustomersCount; }

    public BigDecimal getActualBusinessRevenue() { return actualBusinessRevenue; }
    public void setActualBusinessRevenue(BigDecimal actualBusinessRevenue) { this.actualBusinessRevenue = actualBusinessRevenue; }

    public BigDecimal getActualBusinessCosts() { return actualBusinessCosts; }
    public void setActualBusinessCosts(BigDecimal actualBusinessCosts) { this.actualBusinessCosts = actualBusinessCosts; }

    public BigDecimal getActualNetBusinessProfit() { return actualNetBusinessProfit; }
    public void setActualNetBusinessProfit(BigDecimal actualNetBusinessProfit) { this.actualNetBusinessProfit = actualNetBusinessProfit; }

    public List<RoadmapTaskDto> getUpcomingMilestones() { return upcomingMilestones; }
    public void setUpcomingMilestones(List<RoadmapTaskDto> upcomingMilestones) { this.upcomingMilestones = upcomingMilestones; }

    public List<DailyActionDto> getTodayActions() { return todayActions; }
    public void setTodayActions(List<DailyActionDto> todayActions) { this.todayActions = todayActions; }

    public String getPacingStatus() { return pacingStatus; }
    public void setPacingStatus(String pacingStatus) { this.pacingStatus = pacingStatus; }

    public List<String> getStrategicRecommendations() { return strategicRecommendations; }
    public void setStrategicRecommendations(List<String> strategicRecommendations) { this.strategicRecommendations = strategicRecommendations; }
}
