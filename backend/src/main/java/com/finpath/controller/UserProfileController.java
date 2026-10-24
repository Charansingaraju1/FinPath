package com.finpath.controller;

import com.finpath.dto.ApiResponse;
import com.finpath.dto.UserProfileDto;
import com.finpath.entity.User;
import com.finpath.service.AuthService;
import com.finpath.service.UserProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
public class UserProfileController {

    private final UserProfileService profileService;
    private final AuthService authService;

    public UserProfileController(UserProfileService profileService, AuthService authService) {
        this.profileService = profileService;
        this.authService = authService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<UserProfileDto>> getProfile(Authentication auth) {
        User user = authService.getUserByEmail(auth.getName());
        UserProfileDto dto = profileService.getProfile(user.getId());
        return ResponseEntity.ok(ApiResponse.ok(dto));
    }

    @PutMapping
    public ResponseEntity<ApiResponse<UserProfileDto>> updateProfile(@RequestBody UserProfileDto dto, Authentication auth) {
        User user = authService.getUserByEmail(auth.getName());
        UserProfileDto updated = profileService.updateProfile(user, dto);
        return ResponseEntity.ok(ApiResponse.ok("Profile updated successfully", updated));
    }
}
