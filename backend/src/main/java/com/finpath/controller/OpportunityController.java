package com.finpath.controller;

import com.finpath.dto.ApiResponse;
import com.finpath.dto.OpportunityDto;
import com.finpath.dto.OpportunitySubmissionRequest;
import com.finpath.entity.OpportunityCategory;
import com.finpath.entity.User;
import com.finpath.service.AuthService;
import com.finpath.service.OpportunityService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/opportunities")
public class OpportunityController {

    private final OpportunityService opportunityService;
    private final AuthService authService;

    public OpportunityController(OpportunityService opportunityService, AuthService authService) {
        this.opportunityService = opportunityService;
        this.authService = authService;
    }

    @GetMapping("/public")
    public ResponseEntity<ApiResponse<List<OpportunityDto>>> getPublicOpportunities() {
        return ResponseEntity.ok(ApiResponse.ok(opportunityService.getPublicOpportunities()));
    }

    @GetMapping("/categories")
    public ResponseEntity<ApiResponse<List<OpportunityCategory>>> getCategories() {
        return ResponseEntity.ok(ApiResponse.ok(opportunityService.getAllCategories()));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<OpportunityDto>>> searchOpportunities(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String difficulty,
            @RequestParam(required = false) String validationStatus,
            Authentication auth) {
        Long userId = (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getName()))
                ? authService.getUserByEmail(auth.getName()).getId()
                : null;
        List<OpportunityDto> list = opportunityService.searchOpportunities(query, categoryId, difficulty, validationStatus, userId);
        return ResponseEntity.ok(ApiResponse.ok(list));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OpportunityDto>> getOpportunity(@PathVariable Long id, Authentication auth) {
        Long userId = (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getName()))
                ? authService.getUserByEmail(auth.getName()).getId()
                : null;
        return ResponseEntity.ok(ApiResponse.ok(opportunityService.getOpportunityById(id, userId)));
    }

    @PostMapping("/{id}/save")
    public ResponseEntity<ApiResponse<Void>> toggleSave(@PathVariable Long id, Authentication auth) {
        User user = authService.getUserByEmail(auth.getName());
        opportunityService.toggleSaveOpportunity(id, user);
        return ResponseEntity.ok(ApiResponse.ok("Opportunity bookmark toggled", null));
    }

    @GetMapping("/saved")
    public ResponseEntity<ApiResponse<List<OpportunityDto>>> getSavedOpportunities(Authentication auth) {
        User user = authService.getUserByEmail(auth.getName());
        return ResponseEntity.ok(ApiResponse.ok(opportunityService.getSavedOpportunities(user.getId())));
    }

    @PostMapping("/submit")
    public ResponseEntity<ApiResponse<OpportunityDto>> submitProblem(
            @Valid @RequestBody OpportunitySubmissionRequest request,
            Authentication auth) {
        User user = authService.getUserByEmail(auth.getName());
        OpportunityDto dto = opportunityService.submitProblem(user, request);
        return ResponseEntity.ok(ApiResponse.ok("Problem submitted successfully", dto));
    }

    @PostMapping("/compare")
    public ResponseEntity<ApiResponse<List<OpportunityDto>>> compare(
            @RequestBody List<Long> ids,
            Authentication auth) {
        Long userId = (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getName()))
                ? authService.getUserByEmail(auth.getName()).getId()
                : null;
        return ResponseEntity.ok(ApiResponse.ok(opportunityService.compareOpportunities(ids, userId)));
    }
}
