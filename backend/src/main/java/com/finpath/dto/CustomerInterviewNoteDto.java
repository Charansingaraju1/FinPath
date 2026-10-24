package com.finpath.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;

public class CustomerInterviewNoteDto {
    private Long id;
    private Long validationId;
    private String intervieweeName;
    private String customerType;

    @NotBlank(message = "Interview notes are required")
    private String notes;

    private Boolean confirmedProblem = false;
    private BigDecimal willingnessToPayAmount = BigDecimal.ZERO;

    @NotNull(message = "Interview date is required")
    private LocalDate interviewDate;

    public CustomerInterviewNoteDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getValidationId() { return validationId; }
    public void setValidationId(Long validationId) { this.validationId = validationId; }

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
}
