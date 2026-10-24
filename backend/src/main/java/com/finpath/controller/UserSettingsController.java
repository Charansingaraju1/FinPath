package com.finpath.controller;

import com.finpath.dto.ApiResponse;
import com.finpath.entity.User;
import com.finpath.entity.UserSettings;
import com.finpath.service.AuthService;
import com.finpath.service.UserSettingsService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/settings")
public class UserSettingsController {

    private final UserSettingsService settingsService;
    private final AuthService authService;

    public UserSettingsController(UserSettingsService settingsService, AuthService authService) {
        this.settingsService = settingsService;
        this.authService = authService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<UserSettings>> getSettings(Authentication auth) {
        User user = authService.getUserByEmail(auth.getName());
        return ResponseEntity.ok(ApiResponse.ok(settingsService.getSettings(user)));
    }

    @PutMapping
    public ResponseEntity<ApiResponse<UserSettings>> updateSettings(
            @RequestParam(required = false) String theme,
            @RequestParam(required = false) Boolean emailNotifications,
            @RequestParam(required = false) Boolean privacyMode,
            Authentication auth) {
        User user = authService.getUserByEmail(auth.getName());
        return ResponseEntity.ok(ApiResponse.ok("Preferences saved",
                settingsService.updateSettings(user, theme, emailNotifications, privacyMode)));
    }

    @GetMapping("/export")
    public ResponseEntity<ApiResponse<Map<String, Object>>> exportData(Authentication auth) {
        User user = authService.getUserByEmail(auth.getName());
        return ResponseEntity.ok(ApiResponse.ok(settingsService.exportUserData(user)));
    }

    @DeleteMapping("/account")
    public ResponseEntity<ApiResponse<Void>> deleteAccount(Authentication auth) {
        User user = authService.getUserByEmail(auth.getName());
        settingsService.deleteAccount(user);
        return ResponseEntity.ok(ApiResponse.ok("Account deleted successfully", null));
    }
}
