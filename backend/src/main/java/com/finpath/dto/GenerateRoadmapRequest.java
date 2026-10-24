package com.finpath.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class GenerateRoadmapRequest {
    private Long goalId;
    private Long opportunityId;

    @NotNull(message = "Duration in months is required (3, 6, or 12)")
    @Min(value = 3, message = "Minimum duration is 3 months")
    @Max(value = 12, message = "Maximum duration is 12 months")
    private Integer durationMonths = 6;

    public GenerateRoadmapRequest() {}

    public Long getGoalId() { return goalId; }
    public void setGoalId(Long goalId) { this.goalId = goalId; }

    public Long getOpportunityId() { return opportunityId; }
    public void setOpportunityId(Long opportunityId) { this.opportunityId = opportunityId; }

    public Integer getDurationMonths() { return durationMonths; }
    public void setDurationMonths(Integer durationMonths) { this.durationMonths = durationMonths; }
}
