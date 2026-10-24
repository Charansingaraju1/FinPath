package com.finpath.dto;

import java.time.LocalDate;

public class DailyActionDto {
    private Long taskId;
    private String title;
    private String stage;
    private String priority;
    private Double estimatedHours;
    private LocalDate dueDate;
    private String reason;

    public DailyActionDto() {}

    public DailyActionDto(Long taskId, String title, String stage, String priority, Double estimatedHours, LocalDate dueDate, String reason) {
        this.taskId = taskId;
        this.title = title;
        this.stage = stage;
        this.priority = priority;
        this.estimatedHours = estimatedHours;
        this.dueDate = dueDate;
        this.reason = reason;
    }

    public Long getTaskId() { return taskId; }
    public void setTaskId(Long taskId) { this.taskId = taskId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getStage() { return stage; }
    public void setStage(String stage) { this.stage = stage; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public Double getEstimatedHours() { return estimatedHours; }
    public void setEstimatedHours(Double estimatedHours) { this.estimatedHours = estimatedHours; }

    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
}
