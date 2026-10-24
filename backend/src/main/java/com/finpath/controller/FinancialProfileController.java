package com.finpath.controller;

import com.finpath.dto.ApiResponse;
import com.finpath.dto.FinancialProfileDto;
import com.finpath.entity.User;
import com.finpath.service.AuthService;
import com.finpath.service.FinancialProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/financial-profile")
public class FinancialProfileController {

    private final FinancialProfileService financialProfileService;
    private final AuthService authService;

    public FinancialProfileController(FinancialProfileService financialProfileService, AuthService authService) {
        this.financialProfileService = financialProfileService;
        this.authService = authService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<FinancialProfileDto>> getProfile(Authentication auth) {
        User user = authService.getUserByEmail(auth.getName());
        FinancialProfileDto dto = financialProfileService.getProfileDto(user.getId());
        return ResponseEntity.ok(ApiResponse.ok(dto));
    }

    @PutMapping
    public ResponseEntity<ApiResponse<FinancialProfileDto>> updateProfile(@RequestBody FinancialProfileDto dto, Authentication auth) {
        User user = authService.getUserByEmail(auth.getName());
        FinancialProfileDto updated = financialProfileService.updateProfile(user, dto);
        return ResponseEntity.ok(ApiResponse.ok("Financial profile updated successfully", updated));
    }
}
