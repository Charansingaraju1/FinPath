package com.finpath.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "opportunity_validations", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "opportunity_id"})
})
public class OpportunityValidation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "opportunity_id", nullable = false)
    private Opportunity opportunity;

    @Column(nullable = false)
    private String stage = "NOT_STARTED"; // NOT_STARTED, RESEARCHING, INTERVIEWING, PROBLEM_CONFIRMED, WILLINGNESS_TO_PAY_TESTED, READY_TO_BUILD, REJECTED

    @Column(name = "problem_statement", columnDefinition = "TEXT")
    private String problemStatement;

    @Column(name = "target_customer_profile", columnDefinition = "TEXT")
    private String targetCustomerProfile;

    @Column(name = "hypotheses_to_test", columnDefinition = "TEXT")
    private String hypothesesToTest;

    @Column(name = "interview_question_suggestions", columnDefinition = "TEXT")
    private String interviewQuestionSuggestions;

    @Column(name = "people_interviewed_count", nullable = false)
    private Integer peopleInterviewedCount = 0;

    @Column(name = "confirmed_problem_count", nullable = false)
    private Integer confirmedProblemCount = 0;

    @Column(name = "current_alternatives", columnDefinition = "TEXT")
    private String currentAlternatives;

    @Column(name = "willingness_to_pay_evidence", columnDefinition = "TEXT")
    private String willingnessToPayEvidence;

    @Column(name = "estimated_solution_cost", nullable = false)
    private BigDecimal estimatedSolutionCost = BigDecimal.ZERO;

    @Column(name = "validation_notes", columnDefinition = "TEXT")
    private String validationNotes;

    @Column(name = "next_experiment", columnDefinition = "TEXT")
    private String nextExperiment;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();

    @OneToMany(mappedBy = "validation", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CustomerInterviewNote> interviewNotes = new ArrayList<>();

    public OpportunityValidation() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Opportunity getOpportunity() { return opportunity; }
    public void setOpportunity(Opportunity opportunity) { this.opportunity = opportunity; }

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

    public List<CustomerInterviewNote> getInterviewNotes() { return interviewNotes; }
    public void setInterviewNotes(List<CustomerInterviewNote> interviewNotes) { this.interviewNotes = interviewNotes; }

    @PreUpdate
    public void onUpdate() { this.updatedAt = LocalDateTime.now(); }
}
