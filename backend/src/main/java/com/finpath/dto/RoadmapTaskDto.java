package com.finpath.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class RoadmapTaskDto {
    private Long id;
    private Long roadmapId;
    private String stage;
    private Integer stageIndex;
    private Integer taskIndex;
    private String title;
    private String description;
    private LocalDate dueDate;
    private String priority;
    private Double estimatedHours;
    private BigDecimal estimatedCost;
    private Boolean isCompleted;
    private LocalDateTime completedAt;
    private String successCriteria;
    private String dependencies;

    public RoadmapTaskDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getRoadmapId() { return roadmapId; }
    public void setRoadmapId(Long roadmapId) { this.roadmapId = roadmapId; }

    public String getStage() { return stage; }
    public void setStage(String stage) { this.stage = stage; }

    public Integer getStageIndex() { return stageIndex; }
    public void setStageIndex(Integer stageIndex) { this.stageIndex = stageIndex; }

    public Integer getTaskIndex() { return taskIndex; }
    public void setTaskIndex(Integer taskIndex) { this.taskIndex = taskIndex; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public Double getEstimatedHours() { return estimatedHours; }
    public void setEstimatedHours(Double estimatedHours) { this.estimatedHours = estimatedHours; }

    public BigDecimal getEstimatedCost() { return estimatedCost; }
    public void setEstimatedCost(BigDecimal estimatedCost) { this.estimatedCost = estimatedCost; }

    public Boolean getIsCompleted() { return isCompleted; }
    public void setIsCompleted(Boolean isCompleted) { this.isCompleted = isCompleted; }

    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }

    public String getSuccessCriteria() { return successCriteria; }
    public void setSuccessCriteria(String successCriteria) { this.successCriteria = successCriteria; }

    public String getDependencies() { return dependencies; }
    public void setDependencies(String dependencies) { this.dependencies = dependencies; }
}
