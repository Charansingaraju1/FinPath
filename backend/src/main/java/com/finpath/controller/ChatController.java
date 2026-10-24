package com.finpath.controller;

import com.finpath.dto.ApiResponse;
import com.finpath.dto.ChatRequest;
import com.finpath.dto.ChatResponse;
import com.finpath.service.ChatAssistantService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final ChatAssistantService chatService;

    public ChatController(ChatAssistantService chatService) {
        this.chatService = chatService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ChatResponse>> chat(
            @Valid @RequestBody ChatRequest request,
            HttpServletRequest servletRequest) {
        String clientIp = servletRequest.getHeader("X-Forwarded-For");
        if (clientIp == null || clientIp.isBlank()) {
            clientIp = servletRequest.getRemoteAddr();
        }
        ChatResponse response = chatService.processChat(request, clientIp);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/status")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getChatStatus() {
        boolean configured = chatService.isExternalAiConfigured();
        Map<String, Object> status = Map.of(
                "externalAiConfigured", configured,
                "provider", configured ? "external-ai" : "local-rule-engine",
                "mode", "Educational Assistant",
                "maxCharacters", 500
        );
        return ResponseEntity.ok(ApiResponse.ok(status));
    }
}
