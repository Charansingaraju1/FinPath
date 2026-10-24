package com.finpath.service;

import com.finpath.dto.CustomerInterviewNoteDto;
import com.finpath.dto.ValidationWorkspaceDto;
import com.finpath.entity.CustomerInterviewNote;
import com.finpath.entity.Opportunity;
import com.finpath.entity.OpportunityValidation;
import com.finpath.entity.User;
import com.finpath.exception.ResourceNotFoundException;
import com.finpath.repository.CustomerInterviewNoteRepository;
import com.finpath.repository.OpportunityRepository;
import com.finpath.repository.OpportunityValidationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class OpportunityValidationService {

    private final OpportunityValidationRepository validationRepository;
    private final OpportunityRepository opportunityRepository;
    private final CustomerInterviewNoteRepository interviewNoteRepository;

    public OpportunityValidationService(OpportunityValidationRepository validationRepository,
                                      OpportunityRepository opportunityRepository,
                                      CustomerInterviewNoteRepository interviewNoteRepository) {
        this.validationRepository = validationRepository;
        this.opportunityRepository = opportunityRepository;
        this.interviewNoteRepository = interviewNoteRepository;
    }

    public ValidationWorkspaceDto getOrCreateValidation(Long opportunityId, User user) {
        Opportunity opportunity = opportunityRepository.findById(opportunityId)
                .orElseThrow(() -> new ResourceNotFoundException("Opportunity not found"));

        OpportunityValidation val = validationRepository.findByUserIdAndOpportunityId(user.getId(), opportunityId)
                .orElseGet(() -> {
                    OpportunityValidation newValidation = new OpportunityValidation();
                    newValidation.setUser(user);
                    newValidation.setOpportunity(opportunity);
                    newValidation.setStage("NOT_STARTED");
                    newValidation.setProblemStatement(opportunity.getDescription());
                    newValidation.setTargetCustomerProfile(opportunity.getTargetCustomer());
                    newValidation.setHypothesesToTest("Hypothesis: " + opportunity.getTargetCustomer() + " struggles with " + opportunity.getTitle() + " and will pay for a streamlined solution.");
                    newValidation.setInterviewQuestionSuggestions(
                            "1. How do you currently handle this task?\n" +
                            "2. What is the most painful or time-consuming part of that workflow?\n" +
                            "3. How much time or money do you estimate you lose each month because of this?\n" +
                            "4. Have you actively tried any software or service to solve this? Why didn't it work?");
                    newValidation.setCurrentAlternatives("Manual spreadsheets, paper notebooks, or leaving it undone");
                    newValidation.setEstimatedSolutionCost(opportunity.getInitialCostMin());
                    newValidation.setNextExperiment("Reach out to 5 potential prospects and schedule brief discovery calls.");
                    return validationRepository.save(newValidation);
                });

        return mapToDto(val);
    }

    @Transactional
    public ValidationWorkspaceDto updateValidation(Long opportunityId, User user, ValidationWorkspaceDto dto) {
        ValidationWorkspaceDto existing = getOrCreateValidation(opportunityId, user);
        OpportunityValidation val = validationRepository.findById(existing.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Validation record not found"));

        if (dto.getStage() != null) val.setStage(dto.getStage());
        if (dto.getProblemStatement() != null) val.setProblemStatement(dto.getProblemStatement());
        if (dto.getTargetCustomerProfile() != null) val.setTargetCustomerProfile(dto.getTargetCustomerProfile());
        if (dto.getHypothesesToTest() != null) val.setHypothesesToTest(dto.getHypothesesToTest());
        if (dto.getInterviewQuestionSuggestions() != null) val.setInterviewQuestionSuggestions(dto.getInterviewQuestionSuggestions());
        if (dto.getCurrentAlternatives() != null) val.setCurrentAlternatives(dto.getCurrentAlternatives());
        if (dto.getWillingnessToPayEvidence() != null) val.setWillingnessToPayEvidence(dto.getWillingnessToPayEvidence());
        if (dto.getEstimatedSolutionCost() != null) val.setEstimatedSolutionCost(dto.getEstimatedSolutionCost());
        if (dto.getValidationNotes() != null) val.setValidationNotes(dto.getValidationNotes());
        if (dto.getNextExperiment() != null) val.setNextExperiment(dto.getNextExperiment());

        val = validationRepository.save(val);
        return mapToDto(val);
    }

    @Transactional
    public CustomerInterviewNoteDto addInterviewNote(Long validationId, User user, CustomerInterviewNoteDto dto) {
        OpportunityValidation val = validationRepository.findById(validationId)
                .orElseThrow(() -> new ResourceNotFoundException("Validation record not found"));

        if (!val.getUser().getId().equals(user.getId())) {
            throw new SecurityException("Unauthorized access to validation record");
        }

        CustomerInterviewNote note = new CustomerInterviewNote();
        note.setValidation(val);
        note.setIntervieweeName(dto.getIntervieweeName());
        note.setCustomerType(dto.getCustomerType());
        note.setNotes(dto.getNotes());
        note.setConfirmedProblem(Boolean.TRUE.equals(dto.getConfirmedProblem()));
        note.setWillingnessToPayAmount(dto.getWillingnessToPayAmount() != null ? dto.getWillingnessToPayAmount() : BigDecimal.ZERO);
        note.setInterviewDate(dto.getInterviewDate() != null ? dto.getInterviewDate() : LocalDate.now());

        note = interviewNoteRepository.save(note);

        // Update counts on validation parent
        val.setPeopleInterviewedCount(val.getPeopleInterviewedCount() + 1);
        if (note.getConfirmedProblem()) {
            val.setConfirmedProblemCount(val.getConfirmedProblemCount() + 1);
        }
        validationRepository.save(val);

        return mapNoteToDto(note);
    }

    public List<CustomerInterviewNoteDto> getInterviewNotes(Long validationId, User user) {
        OpportunityValidation val = validationRepository.findById(validationId)
                .orElseThrow(() -> new ResourceNotFoundException("Validation record not found"));
        if (!val.getUser().getId().equals(user.getId())) {
            throw new SecurityException("Unauthorized");
        }
        return interviewNoteRepository.findByValidationIdOrderByInterviewDateDesc(validationId).stream()
                .map(this::mapNoteToDto)
                .collect(Collectors.toList());
    }

    private int calculateValidationScore(OpportunityValidation v) {
        int score = 10;
        if (v.getPeopleInterviewedCount() >= 5) score += 30;
        else score += v.getPeopleInterviewedCount() * 6;

        if (v.getConfirmedProblemCount() >= 3) score += 30;
        else score += v.getConfirmedProblemCount() * 10;

        if (v.getWillingnessToPayEvidence() != null && !v.getWillingnessToPayEvidence().isBlank()) score += 20;
        if ("READY_TO_BUILD".equals(v.getStage())) score += 10;
        return Math.min(100, score);
    }

    public ValidationWorkspaceDto mapToDto(OpportunityValidation val) {
        ValidationWorkspaceDto dto = new ValidationWorkspaceDto();
        dto.setId(val.getId());
        dto.setOpportunityId(val.getOpportunity().getId());
        dto.setOpportunityTitle(val.getOpportunity().getTitle());
        dto.setStage(val.getStage());
        dto.setProblemStatement(val.getProblemStatement());
        dto.setTargetCustomerProfile(val.getTargetCustomerProfile());
        dto.setHypothesesToTest(val.getHypothesesToTest());
        dto.setInterviewQuestionSuggestions(val.getInterviewQuestionSuggestions());
        dto.setPeopleInterviewedCount(val.getPeopleInterviewedCount());
        dto.setConfirmedProblemCount(val.getConfirmedProblemCount());
        dto.setCurrentAlternatives(val.getCurrentAlternatives());
        dto.setWillingnessToPayEvidence(val.getWillingnessToPayEvidence());
        dto.setEstimatedSolutionCost(val.getEstimatedSolutionCost());
        dto.setValidationNotes(val.getValidationNotes());
        dto.setNextExperiment(val.getNextExperiment());
        dto.setUpdatedAt(val.getUpdatedAt());
        dto.setValidationScore(calculateValidationScore(val));

        List<CustomerInterviewNote> notes = interviewNoteRepository.findByValidationIdOrderByInterviewDateDesc(val.getId());
        dto.setInterviewNotes(notes.stream().map(this::mapNoteToDto).collect(Collectors.toList()));
        return dto;
    }

    public CustomerInterviewNoteDto mapNoteToDto(CustomerInterviewNote note) {
        CustomerInterviewNoteDto dto = new CustomerInterviewNoteDto();
        dto.setId(note.getId());
        dto.setValidationId(note.getValidation().getId());
        dto.setIntervieweeName(note.getIntervieweeName());
        dto.setCustomerType(note.getCustomerType());
        dto.setNotes(note.getNotes());
        dto.setConfirmedProblem(note.getConfirmedProblem());
        dto.setWillingnessToPayAmount(note.getWillingnessToPayAmount());
        dto.setInterviewDate(note.getInterviewDate());
        return dto;
    }
}
