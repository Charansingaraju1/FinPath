package com.finpath.controller;

import com.finpath.dto.ApiResponse;
import com.finpath.dto.FinancialCalculationResult;
import com.finpath.dto.GoalAssessmentDto;
import com.finpath.entity.FinancialGoal;
import com.finpath.entity.FinancialProfile;
import com.finpath.entity.User;
import com.finpath.repository.FinancialGoalRepository;
import com.finpath.repository.FinancialProfileRepository;
import com.finpath.service.AuthService;
import com.finpath.service.FinancialCalculationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/calculations")
public class FinancialCalculationController {

    private final FinancialCalculationService calculationService;
    private final FinancialProfileRepository financialProfileRepository;
    private final FinancialGoalRepository financialGoalRepository;
    private final AuthService authService;

    public FinancialCalculationController(FinancialCalculationService calculationService,
                                         FinancialProfileRepository financialProfileRepository,
                                         FinancialGoalRepository financialGoalRepository,
                                         AuthService authService) {
        this.calculationService = calculationService;
        this.financialProfileRepository = financialProfileRepository;
        this.financialGoalRepository = financialGoalRepository;
        this.authService = authService;
    }

    @GetMapping("/overview")
    public ResponseEntity<ApiResponse<FinancialCalculationResult>> getOverview(Authentication auth) {
        User user = authService.getUserByEmail(auth.getName());
        FinancialProfile profile = financialProfileRepository.findByUserId(user.getId()).orElse(null);
        FinancialGoal activeGoal = financialGoalRepository.findFirstByUserIdAndStatusOrderByCreatedAtDesc(user.getId(), "ACTIVE").orElse(null);

        FinancialCalculationResult result = calculationService.calculateOverview(profile, activeGoal);
        return ResponseEntity.ok(ApiResponse.ok(result));
    }

    @PostMapping("/assess-custom")
    public ResponseEntity<ApiResponse<GoalAssessmentDto>> assessCustom(
            @RequestBody FinancialProfile customProfile,
            @RequestParam(required = false) Long goalId,
            Authentication auth) {
        User user = authService.getUserByEmail(auth.getName());
        FinancialGoal goal = null;
        if (goalId != null) {
            goal = financialGoalRepository.findByIdAndUserId(goalId, user.getId()).orElse(null);
        } else {
            goal = financialGoalRepository.findFirstByUserIdAndStatusOrderByCreatedAtDesc(user.getId(), "ACTIVE").orElse(null);
        }

        GoalAssessmentDto assessment = calculationService.assessGoalFeasibility(customProfile, goal, LocalDate.now());
        return ResponseEntity.ok(ApiResponse.ok(assessment));
    }
}
