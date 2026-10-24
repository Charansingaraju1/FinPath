package com.finpath.controller;

import com.finpath.dto.ApiResponse;
import com.finpath.dto.AuthResponse;
import com.finpath.dto.LoginRequest;
import com.finpath.dto.RegisterRequest;
import com.finpath.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.ok(ApiResponse.ok("Registration successful", response));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.ok("Login successful", response));
    }

    @PostMapping("/demo")
    public ResponseEntity<ApiResponse<AuthResponse>> demoLogin() {
        AuthResponse response = authService.getOrCreateDemoUser();
        return ResponseEntity.ok(ApiResponse.ok("Demo login successful", response));
    }

    @PostMapping("/admin-demo")
    public ResponseEntity<ApiResponse<AuthResponse>> adminDemoLogin() {
        AuthResponse response = authService.getOrCreateAdminUser();
        return ResponseEntity.ok(ApiResponse.ok("Admin demo login successful", response));
    }
}
