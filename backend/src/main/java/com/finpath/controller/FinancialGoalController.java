package com.finpath.controller;

import com.finpath.dto.ApiResponse;
import com.finpath.dto.FinancialGoalDto;
import com.finpath.dto.GoalAssessmentDto;
import com.finpath.entity.User;
import com.finpath.service.AuthService;
import com.finpath.service.FinancialGoalService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/goals")
public class FinancialGoalController {

    private final FinancialGoalService goalService;
    private final AuthService authService;

    public FinancialGoalController(FinancialGoalService goalService, AuthService authService) {
        this.goalService = goalService;
        this.authService = authService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<FinancialGoalDto>>> getGoals(Authentication auth) {
        User user = authService.getUserByEmail(auth.getName());
        return ResponseEntity.ok(ApiResponse.ok(goalService.getUserGoals(user.getId())));
    }

    @GetMapping("/active")
    public ResponseEntity<ApiResponse<FinancialGoalDto>> getActiveGoal(Authentication auth) {
        User user = authService.getUserByEmail(auth.getName());
        return ResponseEntity.ok(ApiResponse.ok(goalService.getActiveGoal(user.getId())));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<FinancialGoalDto>> createGoal(@Valid @RequestBody FinancialGoalDto dto, Authentication auth) {
        User user = authService.getUserByEmail(auth.getName());
        FinancialGoalDto created = goalService.createGoal(user, dto);
        return ResponseEntity.ok(ApiResponse.ok("Goal created successfully", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<FinancialGoalDto>> updateGoal(@PathVariable Long id, @RequestBody FinancialGoalDto dto, Authentication auth) {
        User user = authService.getUserByEmail(auth.getName());
        FinancialGoalDto updated = goalService.updateGoal(id, user.getId(), dto);
        return ResponseEntity.ok(ApiResponse.ok("Goal updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteGoal(@PathVariable Long id, Authentication auth) {
        User user = authService.getUserByEmail(auth.getName());
        goalService.deleteGoal(id, user.getId());
        return ResponseEntity.ok(ApiResponse.ok("Goal deleted successfully", null));
    }

    @GetMapping("/{id}/assess")
    public ResponseEntity<ApiResponse<GoalAssessmentDto>> assessGoal(@PathVariable Long id, Authentication auth) {
        User user = authService.getUserByEmail(auth.getName());
        return ResponseEntity.ok(ApiResponse.ok(goalService.assessGoal(id, user.getId())));
    }
}
