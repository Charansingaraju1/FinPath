package com.finpath.service;

import com.finpath.dto.FinancialGoalDto;
import com.finpath.dto.GoalAssessmentDto;
import com.finpath.entity.FinancialGoal;
import com.finpath.entity.FinancialProfile;
import com.finpath.entity.User;
import com.finpath.exception.ResourceNotFoundException;
import com.finpath.repository.FinancialGoalRepository;
import com.finpath.repository.FinancialProfileRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FinancialGoalService {

    private final FinancialGoalRepository goalRepository;
    private final FinancialProfileRepository financialProfileRepository;
    private final FinancialCalculationService calculationService;

    public FinancialGoalService(FinancialGoalRepository goalRepository,
                                FinancialProfileRepository financialProfileRepository,
                                FinancialCalculationService calculationService) {
        this.goalRepository = goalRepository;
        this.financialProfileRepository = financialProfileRepository;
        this.calculationService = calculationService;
    }

    public List<FinancialGoalDto> getUserGoals(Long userId) {
        return goalRepository.findByUserIdOrderByDeadlineAsc(userId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public FinancialGoalDto getActiveGoal(Long userId) {
        FinancialGoal goal = goalRepository.findFirstByUserIdAndStatusOrderByCreatedAtDesc(userId, "ACTIVE")
                .orElse(null);
        return goal != null ? mapToDto(goal) : null;
    }

    @Transactional
    public FinancialGoalDto createGoal(User user, FinancialGoalDto dto) {
        FinancialGoal goal = new FinancialGoal();
        goal.setUser(user);
        goal.setGoalType(dto.getGoalType() != null ? dto.getGoalType() : "SAVINGS");
        goal.setTitle(dto.getTitle());
        goal.setTargetAmount(dto.getTargetAmount());
        goal.setCurrentAllocated(dto.getCurrentAllocated() != null ? dto.getCurrentAllocated() : BigDecimal.ZERO);
        goal.setDeadline(dto.getDeadline() != null ? dto.getDeadline() : LocalDate.now().plusMonths(6));
        goal.setPriority(dto.getPriority() != null ? dto.getPriority() : "MEDIUM");
        goal.setCurrency(dto.getCurrency() != null ? dto.getCurrency() : "INR");
        goal.setStatus("ACTIVE");

        goal = goalRepository.save(goal);
        return mapToDto(goal);
    }

    @Transactional
    public FinancialGoalDto updateGoal(Long goalId, Long userId, FinancialGoalDto dto) {
        FinancialGoal goal = goalRepository.findByIdAndUserId(goalId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Goal not found"));

        if (dto.getGoalType() != null) goal.setGoalType(dto.getGoalType());
        if (dto.getTitle() != null) goal.setTitle(dto.getTitle());
        if (dto.getTargetAmount() != null) goal.setTargetAmount(dto.getTargetAmount());
        if (dto.getCurrentAllocated() != null) goal.setCurrentAllocated(dto.getCurrentAllocated());
        if (dto.getDeadline() != null) goal.setDeadline(dto.getDeadline());
        if (dto.getPriority() != null) goal.setPriority(dto.getPriority());
        if (dto.getCurrency() != null) goal.setCurrency(dto.getCurrency());
        if (dto.getStatus() != null) goal.setStatus(dto.getStatus());

        goal = goalRepository.save(goal);
        return mapToDto(goal);
    }

    @Transactional
    public void deleteGoal(Long goalId, Long userId) {
        FinancialGoal goal = goalRepository.findByIdAndUserId(goalId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Goal not found"));
        goalRepository.delete(goal);
    }

    public GoalAssessmentDto assessGoal(Long goalId, Long userId) {
        FinancialGoal goal = goalRepository.findByIdAndUserId(goalId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Goal not found"));
        FinancialProfile profile = financialProfileRepository.findByUserId(userId).orElse(null);
        return calculationService.assessGoalFeasibility(profile, goal, LocalDate.now());
    }

    public FinancialGoalDto mapToDto(FinancialGoal goal) {
        FinancialGoalDto dto = new FinancialGoalDto();
        dto.setId(goal.getId());
        dto.setGoalType(goal.getGoalType());
        dto.setTitle(goal.getTitle());
        dto.setTargetAmount(goal.getTargetAmount());
        dto.setCurrentAllocated(goal.getCurrentAllocated());
        dto.setDeadline(goal.getDeadline());
        dto.setPriority(goal.getPriority());
        dto.setCurrency(goal.getCurrency());
        dto.setStatus(goal.getStatus());

        BigDecimal gap = calculationService.calculateRemainingGoalGap(goal);
        long months = calculationService.calculateMonthsRemaining(goal.getDeadline(), LocalDate.now());
        BigDecimal reqMonthly = calculationService.calculateRequiredMonthlyContribution(gap, months);

        dto.setRemainingGap(gap);
        dto.setMonthsRemaining(months);
        dto.setRequiredMonthlyContribution(reqMonthly);

        if (goal.getTargetAmount() != null && goal.getTargetAmount().compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal progress = goal.getCurrentAllocated()
                    .multiply(BigDecimal.valueOf(100))
                    .divide(goal.getTargetAmount(), 1, RoundingMode.HALF_UP);
            dto.setProgressPercentage(progress.min(BigDecimal.valueOf(100)));
        } else {
            dto.setProgressPercentage(BigDecimal.ZERO);
        }

        return dto;
    }
}
