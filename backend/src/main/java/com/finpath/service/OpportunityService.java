package com.finpath.service;

import com.finpath.dto.OpportunityDto;
import com.finpath.dto.OpportunitySubmissionRequest;
import com.finpath.entity.*;
import com.finpath.exception.BadRequestException;
import com.finpath.exception.ResourceNotFoundException;
import com.finpath.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class OpportunityService {

    private final OpportunityRepository opportunityRepository;
    private final OpportunityCategoryRepository categoryRepository;
    private final SavedOpportunityRepository savedRepository;
    private final UserProfileRepository userProfileRepository;
    private final FinancialProfileRepository financialProfileRepository;

    public OpportunityService(OpportunityRepository opportunityRepository,
                              OpportunityCategoryRepository categoryRepository,
                              SavedOpportunityRepository savedRepository,
                              UserProfileRepository userProfileRepository,
                              FinancialProfileRepository financialProfileRepository) {
        this.opportunityRepository = opportunityRepository;
        this.categoryRepository = categoryRepository;
        this.savedRepository = savedRepository;
        this.userProfileRepository = userProfileRepository;
        this.financialProfileRepository = financialProfileRepository;
    }

    public List<OpportunityCategory> getAllCategories() {
        return categoryRepository.findAll();
    }

    public List<OpportunityDto> getPublicOpportunities() {
        return opportunityRepository.findByIsApprovedTrueOrderByBaseFitScoreDesc().stream()
                .map(o -> mapToDto(o, null, null, null))
                .collect(Collectors.toList());
    }

    public List<OpportunityDto> searchOpportunities(String query, Long categoryId, String difficulty, String validationStatus, Long userId) {
        String cleanQuery = (query != null && !query.trim().isBlank()) ? query.trim() : null;
        List<Opportunity> results = opportunityRepository.searchOpportunities(cleanQuery, categoryId, difficulty, validationStatus);

        UserProfile profile = userId != null ? userProfileRepository.findByUserId(userId).orElse(null) : null;
        FinancialProfile finProfile = userId != null ? financialProfileRepository.findByUserId(userId).orElse(null) : null;
        Set<Long> savedIds = userId != null
                ? savedRepository.findByUserIdOrderBySavedAtDesc(userId).stream()
                .map(s -> s.getOpportunity().getId())
                .collect(Collectors.toSet())
                : Collections.emptySet();

        return results.stream()
                .map(o -> mapToDto(o, savedIds, profile, finProfile))
                .sorted((a, b) -> Integer.compare(b.getUserCalculatedFitScore(), a.getUserCalculatedFitScore()))
                .collect(Collectors.toList());
    }

    public OpportunityDto getOpportunityById(Long id, Long userId) {
        Opportunity o = opportunityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Opportunity not found"));

        UserProfile profile = userId != null ? userProfileRepository.findByUserId(userId).orElse(null) : null;
        FinancialProfile finProfile = userId != null ? financialProfileRepository.findByUserId(userId).orElse(null) : null;
        Set<Long> savedIds = userId != null && savedRepository.existsByUserIdAndOpportunityId(userId, id)
                ? Set.of(id)
                : Collections.emptySet();

        return mapToDto(o, savedIds, profile, finProfile);
    }

    @Transactional
    public void toggleSaveOpportunity(Long opportunityId, User user) {
        Opportunity opportunity = opportunityRepository.findById(opportunityId)
                .orElseThrow(() -> new ResourceNotFoundException("Opportunity not found"));

        Optional<SavedOpportunity> existing = savedRepository.findByUserIdAndOpportunityId(user.getId(), opportunityId);
        if (existing.isPresent()) {
            savedRepository.delete(existing.get());
        } else {
            savedRepository.save(new SavedOpportunity(user, opportunity));
        }
    }

    public List<OpportunityDto> getSavedOpportunities(Long userId) {
        List<SavedOpportunity> saved = savedRepository.findByUserIdOrderBySavedAtDesc(userId);
        UserProfile profile = userProfileRepository.findByUserId(userId).orElse(null);
        FinancialProfile finProfile = financialProfileRepository.findByUserId(userId).orElse(null);
        Set<Long> savedIds = saved.stream().map(s -> s.getOpportunity().getId()).collect(Collectors.toSet());

        return saved.stream()
                .map(s -> mapToDto(s.getOpportunity(), savedIds, profile, finProfile))
                .collect(Collectors.toList());
    }

    @Transactional
    public OpportunityDto submitProblem(User user, OpportunitySubmissionRequest request) {
        OpportunityCategory category = null;
        if (request.getCategoryId() != null) {
            category = categoryRepository.findById(request.getCategoryId()).orElse(null);
        }

        Opportunity opp = new Opportunity();
        opp.setCategory(category);
        opp.setTitle(request.getTitle());
        opp.setDescription(request.getDescription());
        opp.setTargetCustomer(request.getTargetCustomer());
        opp.setPotentialSolution(request.getPotentialSolution());
        opp.setRequiredSkills(request.getRequiredSkills());
        opp.setInitialCostMin(request.getInitialCostMin() != null ? request.getInitialCostMin() : BigDecimal.ZERO);
        opp.setInitialCostMax(request.getInitialCostMax() != null ? request.getInitialCostMax() : BigDecimal.ZERO);
        opp.setPricingModel(request.getPricingModel());
        opp.setDifficulty(request.getDifficulty() != null ? request.getDifficulty() : "MEDIUM");
        opp.setTimeCommitment(request.getTimeCommitment() != null ? request.getTimeCommitment() : "10 hrs/week");
        opp.setBusinessModel(request.getBusinessModel() != null ? request.getBusinessModel() : "Freelance");
        opp.setValidationStatus("NOT_STARTED");
        opp.setBaseFitScore(75);
        opp.setIsFeatured(false);
        opp.setIsUserSubmitted(true);
        opp.setCreatedByUser(user);
        opp.setIsApproved(true); // Auto-approve user's own submissions so they can validate immediately

        opp = opportunityRepository.save(opp);
        return mapToDto(opp, null, null, null);
    }

    public List<OpportunityDto> compareOpportunities(List<Long> ids, Long userId) {
        if (ids == null || ids.isEmpty() || ids.size() > 3) {
            throw new BadRequestException("Please select between 1 and 3 opportunities to compare");
        }

        UserProfile profile = userId != null ? userProfileRepository.findByUserId(userId).orElse(null) : null;
        FinancialProfile finProfile = userId != null ? financialProfileRepository.findByUserId(userId).orElse(null) : null;
        Set<Long> savedIds = userId != null
                ? savedRepository.findByUserIdOrderBySavedAtDesc(userId).stream()
                .map(s -> s.getOpportunity().getId())
                .collect(Collectors.toSet())
                : Collections.emptySet();

        return ids.stream()
                .map(id -> opportunityRepository.findById(id).orElse(null))
                .filter(Objects::nonNull)
                .map(o -> mapToDto(o, savedIds, profile, finProfile))
                .collect(Collectors.toList());
    }

    /**
     * Transparent 0-100 Opportunity Fit Score Calculation:
     * - Base opportunity score: 40 pts
     * - User budget affordability: up to 25 pts
     * - Time commitment vs user available hours: up to 20 pts
     * - Skill alignment: up to 15 pts
     */
    public int calculateUserFitScore(Opportunity o, UserProfile profile, FinancialProfile finProfile) {
        int score = (int) (o.getBaseFitScore() * 0.40); // 40% weight on base viability

        // Budget fit:
        if (finProfile != null && finProfile.getAvailableStartupBudget() != null) {
            BigDecimal budget = finProfile.getAvailableStartupBudget();
            if (budget.compareTo(o.getInitialCostMax()) >= 0) {
                score += 25;
            } else if (budget.compareTo(o.getInitialCostMin()) >= 0) {
                score += 15;
            } else {
                score += 5;
            }
        } else {
            score += 15; // default moderate score when profile unset
        }

        // Time fit:
        if (profile != null && profile.getAvailableHoursPerWeek() != null) {
            int availableHours = profile.getAvailableHoursPerWeek();
            if (availableHours >= 15) {
                score += 20;
            } else if (availableHours >= 8) {
                score += 14;
            } else {
                score += 8;
            }
        } else {
            score += 12;
        }

        // Skill alignment:
        if (profile != null && profile.getSkills() != null && !profile.getSkills().isBlank()) {
            String userSkills = profile.getSkills().toLowerCase();
            String oppSkills = o.getRequiredSkills().toLowerCase();
            String[] tokens = oppSkills.split("[,/\\s]+");
            long matched = Arrays.stream(tokens)
                    .filter(token -> token.length() > 3 && userSkills.contains(token))
                    .count();
            if (matched >= 2) {
                score += 15;
            } else if (matched == 1) {
                score += 10;
            } else {
                score += 6;
            }
        } else {
            score += 8;
        }

        return Math.min(99, Math.max(10, score));
    }

    public OpportunityDto mapToDto(Opportunity o, Set<Long> savedIds, UserProfile profile, FinancialProfile finProfile) {
        OpportunityDto dto = new OpportunityDto();
        dto.setId(o.getId());
        if (o.getCategory() != null) {
            dto.setCategoryId(o.getCategory().getId());
            dto.setCategoryName(o.getCategory().getName());
            dto.setCategoryIcon(o.getCategory().getIcon());
        }
        dto.setTitle(o.getTitle());
        dto.setDescription(cleanInrText(o.getDescription()));
        dto.setTargetCustomer(o.getTargetCustomer());
        dto.setPotentialSolution(cleanInrText(o.getPotentialSolution()));
        dto.setRequiredSkills(o.getRequiredSkills());
        dto.setInitialCostMin(o.getInitialCostMin());
        dto.setInitialCostMax(o.getInitialCostMax());
        dto.setPricingModel(cleanInrText(o.getPricingModel()));
        dto.setCompetitionNotes(o.getCompetitionNotes());
        dto.setDifficulty(o.getDifficulty());
        dto.setTimeCommitment(o.getTimeCommitment());
        dto.setBusinessModel(o.getBusinessModel());
        dto.setValidationStatus(o.getValidationStatus());
        dto.setBaseFitScore(o.getBaseFitScore());
        dto.setUserCalculatedFitScore(calculateUserFitScore(o, profile, finProfile));
        dto.setIsFeatured(o.getIsFeatured());
        dto.setIsUserSubmitted(o.getIsUserSubmitted());
        dto.setIsSavedByCurrentUser(savedIds != null && savedIds.contains(o.getId()));
        dto.setIsApproved(o.getIsApproved());
        dto.setCreatedAt(o.getCreatedAt());
        return dto;
    }

    private String cleanInrText(String text) {
        if (text == null) return null;
        return text.replace("\u00e2\u0082\u00b9", "\u20B9").replace("â‚¹", "\u20B9");
    }
}
