package com.finpath.controller;

import com.finpath.dto.ApiResponse;
import com.finpath.service.AiAssistantService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class AiAssistantController {

    private final AiAssistantService aiService;

    public AiAssistantController(AiAssistantService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/brainstorm")
    public ResponseEntity<ApiResponse<Map<String, Object>>> brainstorm(
            @RequestParam(required = false) String problem,
            @RequestParam(required = false) String customer) {
        return ResponseEntity.ok(ApiResponse.ok(aiService.brainstormSolutions(problem, customer)));
    }

    @PostMapping("/interview-questions")
    public ResponseEntity<ApiResponse<Map<String, Object>>> generateQuestions(
            @RequestParam(required = false) String problem,
            @RequestParam(required = false) String customer) {
        return ResponseEntity.ok(ApiResponse.ok(aiService.generateInterviewQuestions(problem, customer)));
    }
}
