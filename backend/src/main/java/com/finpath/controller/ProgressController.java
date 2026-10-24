package com.finpath.controller;

import com.finpath.dto.ApiResponse;
import com.finpath.dto.ProgressReportDto;
import com.finpath.entity.User;
import com.finpath.service.AuthService;
import com.finpath.service.ProgressService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/progress")
public class ProgressController {

    private final ProgressService progressService;
    private final AuthService authService;

    public ProgressController(ProgressService progressService, AuthService authService) {
        this.progressService = progressService;
        this.authService = authService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<ProgressReportDto>> getProgress(Authentication auth) {
        User user = authService.getUserByEmail(auth.getName());
        return ResponseEntity.ok(ApiResponse.ok(progressService.getProgressReport(user.getId())));
    }
}
