package com.finpath.controller;

import com.finpath.dto.*;
import com.finpath.entity.User;
import com.finpath.service.AuthService;
import com.finpath.service.RoadmapService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/roadmaps")
public class RoadmapController {

    private final RoadmapService roadmapService;
    private final AuthService authService;

    public RoadmapController(RoadmapService roadmapService, AuthService authService) {
        this.roadmapService = roadmapService;
        this.authService = authService;
    }

    @GetMapping("/active")
    public ResponseEntity<ApiResponse<RoadmapDto>> getActiveRoadmap(Authentication auth) {
        User user = authService.getUserByEmail(auth.getName());
        return ResponseEntity.ok(ApiResponse.ok(roadmapService.getActiveRoadmap(user.getId())));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<RoadmapDto>> getRoadmap(@PathVariable Long id, Authentication auth) {
        User user = authService.getUserByEmail(auth.getName());
        return ResponseEntity.ok(ApiResponse.ok(roadmapService.getRoadmapById(id, user.getId())));
    }

    @PostMapping("/generate")
    public ResponseEntity<ApiResponse<RoadmapDto>> generateRoadmap(
            @Valid @RequestBody GenerateRoadmapRequest request,
            Authentication auth) {
        User user = authService.getUserByEmail(auth.getName());
        RoadmapDto generated = roadmapService.generateRoadmap(user, request);
        return ResponseEntity.ok(ApiResponse.ok("Personalized roadmap generated successfully", generated));
    }

    @PatchMapping("/tasks/{taskId}/toggle")
    public ResponseEntity<ApiResponse<RoadmapTaskDto>> toggleTask(
            @PathVariable Long taskId,
            Authentication auth) {
        User user = authService.getUserByEmail(auth.getName());
        RoadmapTaskDto updated = roadmapService.toggleTaskCompletion(taskId, user.getId());
        return ResponseEntity.ok(ApiResponse.ok(updated));
    }

    @PostMapping("/{roadmapId}/tasks")
    public ResponseEntity<ApiResponse<RoadmapTaskDto>> addTask(
            @PathVariable Long roadmapId,
            @Valid @RequestBody CreateTaskRequest request,
            Authentication auth) {
        User user = authService.getUserByEmail(auth.getName());
        RoadmapTaskDto created = roadmapService.addTask(roadmapId, user.getId(), request);
        return ResponseEntity.ok(ApiResponse.ok("Custom task added to roadmap", created));
    }

    @GetMapping("/daily-actions")
    public ResponseEntity<ApiResponse<List<DailyActionDto>>> getDailyActions(Authentication auth) {
        User user = authService.getUserByEmail(auth.getName());
        return ResponseEntity.ok(ApiResponse.ok(roadmapService.getDailyActions(user.getId())));
    }
}
