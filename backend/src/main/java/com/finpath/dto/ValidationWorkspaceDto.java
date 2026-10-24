package com.finpath.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class ValidationWorkspaceDto {
    private Long id;
    private Long opportunityId;
    private String opportunityTitle;
    private String stage; // NOT_STARTED, RESEARCHING, INTERVIEWING, PROBLEM_CONFIRMED, WILLINGNESS_TO_PAY_TESTED, READY_TO_BUILD, REJECTED
    private String problemStatement;
    private String targetCustomerProfile;
    private String hypothesesToTest;
    private String interviewQuestionSuggestions;
    private Integer peopleInterviewedCount;
    private Integer confirmedProblemCount;
    private String currentAlternatives;
    private String willingnessToPayEvidence;
    private BigDecimal estimatedSolutionCost;
    private String validationNotes;
    private String nextExperiment;
    private LocalDateTime updatedAt;
    private List<CustomerInterviewNoteDto> interviewNotes;
    private Integer validationScore;

    public ValidationWorkspaceDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getOpportunityId() { return opportunityId; }
    public void setOpportunityId(Long opportunityId) { this.opportunityId = opportunityId; }

    public String getOpportunityTitle() { return opportunityTitle; }
    public void setOpportunityTitle(String opportunityTitle) { this.opportunityTitle = opportunityTitle; }

    public String getStage() { return stage; }
    public void setStage(String stage) { this.stage = stage; }

    public String getProblemStatement() { return problemStatement; }
    public void setProblemStatement(String problemStatement) { this.problemStatement = problemStatement; }

    public String getTargetCustomerProfile() { return targetCustomerProfile; }
    public void setTargetCustomerProfile(String targetCustomerProfile) { this.targetCustomerProfile = targetCustomerProfile; }

    public String getHypothesesToTest() { return hypothesesToTest; }
    public void setHypothesesToTest(String hypothesesToTest) { this.hypothesesToTest = hypothesesToTest; }

    public String getInterviewQuestionSuggestions() { return interviewQuestionSuggestions; }
    public void setInterviewQuestionSuggestions(String interviewQuestionSuggestions) { this.interviewQuestionSuggestions = interviewQuestionSuggestions; }

    public Integer getPeopleInterviewedCount() { return peopleInterviewedCount; }
    public void setPeopleInterviewedCount(Integer peopleInterviewedCount) { this.peopleInterviewedCount = peopleInterviewedCount; }

    public Integer getConfirmedProblemCount() { return confirmedProblemCount; }
    public void setConfirmedProblemCount(Integer confirmedProblemCount) { this.confirmedProblemCount = confirmedProblemCount; }

    public String getCurrentAlternatives() { return currentAlternatives; }
    public void setCurrentAlternatives(String currentAlternatives) { this.currentAlternatives = currentAlternatives; }

    public String getWillingnessToPayEvidence() { return willingnessToPayEvidence; }
    public void setWillingnessToPayEvidence(String willingnessToPayEvidence) { this.willingnessToPayEvidence = willingnessToPayEvidence; }

    public BigDecimal getEstimatedSolutionCost() { return estimatedSolutionCost; }
    public void setEstimatedSolutionCost(BigDecimal estimatedSolutionCost) { this.estimatedSolutionCost = estimatedSolutionCost; }

    public String getValidationNotes() { return validationNotes; }
    public void setValidationNotes(String validationNotes) { this.validationNotes = validationNotes; }

    public String getNextExperiment() { return nextExperiment; }
    public void setNextExperiment(String nextExperiment) { this.nextExperiment = nextExperiment; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public List<CustomerInterviewNoteDto> getInterviewNotes() { return interviewNotes; }
    public void setInterviewNotes(List<CustomerInterviewNoteDto> interviewNotes) { this.interviewNotes = interviewNotes; }

    public Integer getValidationScore() { return validationScore; }
    public void setValidationScore(Integer validationScore) { this.validationScore = validationScore; }
}
