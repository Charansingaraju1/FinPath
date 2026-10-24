package com.finpath.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "customer_interview_notes")
public class CustomerInterviewNote {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "validation_id", nullable = false)
    private OpportunityValidation validation;

    @Column(name = "interviewee_name")
    private String intervieweeName;

    @Column(name = "customer_type")
    private String customerType;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String notes;

    @Column(name = "confirmed_problem", nullable = false)
    private Boolean confirmedProblem = false;

    @Column(name = "willingness_to_pay_amount", nullable = false)
    private BigDecimal willingnessToPayAmount = BigDecimal.ZERO;

    @Column(name = "interview_date", nullable = false)
    private LocalDate interviewDate;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public CustomerInterviewNote() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public OpportunityValidation getValidation() { return validation; }
    public void setValidation(OpportunityValidation validation) { this.validation = validation; }

    public String getIntervieweeName() { return intervieweeName; }
    public void setIntervieweeName(String intervieweeName) { this.intervieweeName = intervieweeName; }

    public String getCustomerType() { return customerType; }
    public void setCustomerType(String customerType) { this.customerType = customerType; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public Boolean getConfirmedProblem() { return confirmedProblem; }
    public void setConfirmedProblem(Boolean confirmedProblem) { this.confirmedProblem = confirmedProblem; }

    public BigDecimal getWillingnessToPayAmount() { return willingnessToPayAmount; }
    public void setWillingnessToPayAmount(BigDecimal willingnessToPayAmount) { this.willingnessToPayAmount = willingnessToPayAmount; }

    public LocalDate getInterviewDate() { return interviewDate; }
    public void setInterviewDate(LocalDate interviewDate) { this.interviewDate = interviewDate; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
