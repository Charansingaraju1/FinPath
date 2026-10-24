package com.finpath.controller;

import com.finpath.dto.ApiResponse;
import com.finpath.dto.CustomerInterviewNoteDto;
import com.finpath.dto.ValidationWorkspaceDto;
import com.finpath.entity.User;
import com.finpath.service.AuthService;
import com.finpath.service.OpportunityValidationService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/validations")
public class ValidationController {

    private final OpportunityValidationService validationService;
    private final AuthService authService;

    public ValidationController(OpportunityValidationService validationService, AuthService authService) {
        this.validationService = validationService;
        this.authService = authService;
    }

    @GetMapping("/{opportunityId}")
    public ResponseEntity<ApiResponse<ValidationWorkspaceDto>> getValidation(
            @PathVariable Long opportunityId,
            Authentication auth) {
        User user = authService.getUserByEmail(auth.getName());
        return ResponseEntity.ok(ApiResponse.ok(validationService.getOrCreateValidation(opportunityId, user)));
    }

    @PutMapping("/{opportunityId}")
    public ResponseEntity<ApiResponse<ValidationWorkspaceDto>> updateValidation(
            @PathVariable Long opportunityId,
            @RequestBody ValidationWorkspaceDto dto,
            Authentication auth) {
        User user = authService.getUserByEmail(auth.getName());
        return ResponseEntity.ok(ApiResponse.ok("Validation progress saved",
                validationService.updateValidation(opportunityId, user, dto)));
    }

    @PostMapping("/{validationId}/notes")
    public ResponseEntity<ApiResponse<CustomerInterviewNoteDto>> addInterviewNote(
            @PathVariable Long validationId,
            @Valid @RequestBody CustomerInterviewNoteDto dto,
            Authentication auth) {
        User user = authService.getUserByEmail(auth.getName());
        return ResponseEntity.ok(ApiResponse.ok("Interview feedback recorded",
                validationService.addInterviewNote(validationId, user, dto)));
    }

    @GetMapping("/{validationId}/notes")
    public ResponseEntity<ApiResponse<List<CustomerInterviewNoteDto>>> getInterviewNotes(
            @PathVariable Long validationId,
            Authentication auth) {
        User user = authService.getUserByEmail(auth.getName());
        return ResponseEntity.ok(ApiResponse.ok(validationService.getInterviewNotes(validationId, user)));
    }
}
