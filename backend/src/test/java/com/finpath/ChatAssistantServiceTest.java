package com.finpath;

import com.finpath.dto.ChatRequest;
import com.finpath.dto.ChatResponse;
import com.finpath.exception.BadRequestException;
import com.finpath.service.ChatAssistantService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;

public class ChatAssistantServiceTest {

    private ChatAssistantService chatService;

    @BeforeEach
    public void setup() {
        chatService = new ChatAssistantService();
    }

    @Test
    public void testProcessChat_GoalQuestion() {
        ChatRequest request = new ChatRequest("How do I set my financial goals?", Collections.emptyList());
        ChatResponse response = chatService.processChat(request, "127.0.0.1");

        assertNotNull(response);
        assertNotNull(response.getReply());
        assertTrue(response.getReply().contains("Setting Financial Goals in FinPath"));
        assertEquals("local-rule-engine", response.getProvider());
        assertFalse(response.isExternalAiConfigured());
        assertTrue(response.getEducationalNotice().contains("local educational mode"));
    }

    @Test
    public void testProcessChat_OpportunityQuestion() {
        ChatRequest request = new ChatRequest("How can I find income opportunities?", Collections.emptyList());
        ChatResponse response = chatService.processChat(request, "127.0.0.1");

        assertNotNull(response);
        assertTrue(response.getReply().contains("Finding Practical Income Opportunities"));
    }

    @Test
    public void testProcessChat_RevenueCalculatorQuestion() {
        ChatRequest request = new ChatRequest("Explain my revenue calculation and break-even formula", Collections.emptyList());
        ChatResponse response = chatService.processChat(request, "127.0.0.1");

        assertNotNull(response);
        assertTrue(response.getReply().contains("How FinPath's Revenue Calculator Works"));
        assertTrue(response.getReply().contains("Break-Even Customers"));
    }

    @Test
    public void testProcessChat_RateLimiting() {
        ChatRequest request = new ChatRequest("Quick question", Collections.emptyList());
        String testIp = "192.168.1.100";

        // Up to 30 requests should succeed
        for (int i = 0; i < 30; i++) {
            chatService.processChat(request, testIp);
        }

        // 31st request should trigger BadRequestException for rate limiting
        assertThrows(BadRequestException.class, () -> chatService.processChat(request, testIp));
    }
}
