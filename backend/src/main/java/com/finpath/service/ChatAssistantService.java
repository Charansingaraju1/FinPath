package com.finpath.service;

import com.finpath.dto.ChatRequest;
import com.finpath.dto.ChatResponse;
import com.finpath.exception.BadRequestException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class ChatAssistantService {

    private static final Logger log = LoggerFactory.getLogger(ChatAssistantService.class);

    private static final String NOTICE_LOCAL = "FinPath Assistant is running in local educational mode. No external AI provider is configured or contacted.";
    private static final String NOTICE_EXTERNAL = "FinPath Assistant provided educational response via configured external AI provider.";

    @Value("${finpath.ai.provider:local}")
    private String provider;

    @Value("${finpath.ai.api-key:}")
    private String apiKey;

    // Simple in-memory rate limiting: max 30 requests per minute per IP key
    private final Map<String, RequestCounter> rateLimiters = new ConcurrentHashMap<>();

    public boolean isExternalAiConfigured() {
        return apiKey != null && !apiKey.isBlank() && !"local".equalsIgnoreCase(provider);
    }

    public ChatResponse processChat(ChatRequest request, String clientIp) {
        enforceRateLimit(clientIp);

        String message = request.getMessage().trim();
        log.info("Processing chat request [length: {}, client: {}]", message.length(), anonymizeIp(clientIp));

        if (isExternalAiConfigured()) {
            try {
                // If external AI is configured, route query securely without any user financial state
                String externalReply = callExternalAi(message);
                if (externalReply != null && !externalReply.isBlank()) {
                    return new ChatResponse(externalReply, provider, NOTICE_EXTERNAL, true);
                }
            } catch (Exception e) {
                log.warn("External AI call failed, falling back to local educational engine: {}", e.getMessage());
            }
        }

        // Default or Fallback: Local rule-based educational assistant
        String localReply = generateLocalResponse(message);
        return new ChatResponse(localReply, "local-rule-engine", NOTICE_LOCAL, false);
    }

    private void enforceRateLimit(String clientIp) {
        String key = clientIp != null ? clientIp : "anonymous";
        long now = System.currentTimeMillis();
        RequestCounter counter = rateLimiters.compute(key, (k, existing) -> {
            if (existing == null || now - existing.windowStart > 60000) {
                return new RequestCounter(now, 1);
            }
            existing.count++;
            return existing;
        });

        if (counter.count > 30) {
            throw new BadRequestException("Rate limit exceeded. Please wait a moment before sending another message.");
        }
    }

    private String generateLocalResponse(String userMsg) {
        String lower = userMsg.toLowerCase();

        // 1. Goal Setting & Feasibility
        if (lower.contains("goal") || lower.contains("target") || lower.contains("emergency fund") || lower.contains("save")) {
            return "### Setting Financial Goals in FinPath\n\n" +
                    "FinPath structures your financial milestones using deterministic math rather than guesswork:\n\n" +
                    "1. **Define Your Target**: Specify what you are saving for (e.g., a 3-month emergency reserve of ₹1,50,000 or tool startup capital) and a target deadline date.\n" +
                    "2. **Monthly Breakdown**: FinPath calculates your required monthly contribution using:\n" +
                    "   `Required Monthly = (Target Amount - Allocated Savings) / Remaining Months`\n" +
                    "3. **Surplus Feasibility**: The system compares your required contribution against your monthly disposable surplus (`Take-Home Income - Living Expenses - Debt`). If your surplus covers the monthly target, your goal is marked **On Track**; otherwise, it flags a financial gap.\n\n" +
                    "> **Educational Note**: FinPath does not connect to your bank account. You track progress manually or by recording savings allocation transactions in the Finances tab.";
        }

        // 2. Opportunities & Problem Discovery
        if (lower.contains("opportunit") || lower.contains("problem") || lower.contains("idea") || lower.contains("fit score") || lower.contains("catalog")) {
            return "### Finding Practical Income Opportunities in FinPath\n\n" +
                    "FinPath focuses on solving real, unglamorous problems that clients actively pay for:\n\n" +
                    "- **Explore the Catalog**: Navigate to the **Opportunities** page to review problems in digital services, operations, workflow automation, and consulting.\n" +
                    "- **Fit Score (0–100)**: Every opportunity is scored based on:\n" +
                    "  - *Base Problem Viability* (40 pts)\n" +
                    "  - *Startup Budget Affordability* (up to 25 pts)\n" +
                    "  - *Time Commitment vs. Available Hours* (up to 20 pts)\n" +
                    "  - *Skill Alignment* (up to 15 pts)\n" +
                    "- **Side-by-Side Comparison**: Select up to 3 opportunities to compare difficulty, initial cost range in INR, and target customer types.\n" +
                    "- **Submit a Custom Problem**: Found a pain point in your local network? Click `Submit Problem` to draft and validate it step-by-step.";
        }

        // 3. Revenue Calculator & Unit Economics
        if (lower.contains("revenue") || lower.contains("calculator") || lower.contains("cac") || lower.contains("break-even") || lower.contains("profit") || lower.contains("cash flow")) {
            return "### How FinPath's Revenue Calculator Works\n\n" +
                    "The **Revenue Calculator** models unit economics before you spend significant personal money:\n\n" +
                    "- **Gross Revenue**: `Expected Clients × Price per Client`\n" +
                    "- **Total Costs**: Sum of variable delivery costs, monthly fixed overhead (software, internet), and Customer Acquisition Cost (`CAC × Clients`).\n" +
                    "- **Operating Profit**: `Gross Revenue - Total Delivery Costs - Fixed Overhead - Total CAC`\n" +
                    "- **Break-Even Customers**: `Monthly Overhead / (Price - Variable Cost - CAC)`. This tells you the minimum number of paying clients needed every month to not lose money.\n" +
                    "- **Scenarios**: It generates Conservative (lower volume, higher CAC), Base, and Optimistic projections to illustrate realistic risk margins.\n\n" +
                    "> **Important**: All projections are hypothetical mathematical models. They are not income guarantees.";
        }

        // 4. Roadmap & Milestone Planning
        if (lower.contains("roadmap") || lower.contains("milestone") || lower.contains("step") || lower.contains("phase") || lower.contains("mvp")) {
            return "### Creating and Following Your Execution Roadmap\n\n" +
                    "FinPath breaks your journey into structured phases adapting to your target timeline (3, 6, or 12 months) and weekly availability:\n\n" +
                    "1. **Phase 1: Validate Demand**: Conduct 5 customer discovery interviews to confirm the recurring pain point and test willingness to pay before writing complex code or buying gear.\n" +
                    "2. **Phase 2: Build MVP**: Create the simplest deliverable that solves the core problem.\n" +
                    "3. **Phase 3: Launch with Pilots**: Onboard 2 founding pilot clients to gather testimonials and refine delivery times.\n" +
                    "4. **Phase 4: Refine & Standardize**: Document SOPs, improve pricing based on actual unit margins.\n" +
                    "5. **Phase 5: Scale Sustainably**: Expand outreach only after proven unit economics.\n\n" +
                    "Visit the **Roadmap** tab to track daily priority tasks, check off completed milestones, and view your completion percentage.";
        }

        // 5. Data Protection, Privacy & Security
        if (lower.contains("protect") || lower.contains("data") || lower.contains("privacy") || lower.contains("secur") || lower.contains("bank") || lower.contains("token")) {
            return "### Data Protection & Privacy in FinPath\n\n" +
                    "FinPath follows privacy-first principles:\n\n" +
                    "- **No Banking Credentials**: We never ask for bank account numbers, UPI PINs, passwords, or credit card details. All numbers are self-reported.\n" +
                    "- **Isolated Storage**: Your financial goals, transactions, and validation workspaces are strictly isolated to your authenticated account ID.\n" +
                    "- **Credential Security**: Passwords are encrypted using BCrypt hashing before storage. Sessions use stateless JWT tokens.\n" +
                    "- **Zero AI Data Leaks**: Your personal financial figures (income, expenses, balances, debt) are **never** transmitted to external AI providers.\n" +
                    "- **Data Control**: You can update your numbers anytime or export/delete your profile from the **Settings** page.";
        }

        // 6. Finances, Transactions & Separation
        if (lower.contains("financ") || lower.contains("transact") || lower.contains("expense") || lower.contains("income") || lower.contains("business vs personal")) {
            return "### Separating Personal & Business Finances in FinPath\n\n" +
                    "Maintaining clean boundaries between personal living and business revenue is vital for financial health:\n\n" +
                    "- **Personal Income & Expenses**: Track your living essentials (rent, food, transit) and discretionary spending.\n" +
                    "- **Business Cash Flow**: Record business revenue and delivery expenses separately. FinPath calculates your **Net Business Profit** independently.\n" +
                    "- **Savings Allocations**: Log contributions toward your active goals to measure real progress against target timelines.\n" +
                    "- **CSV Export**: Export your complete transaction history anytime from the Finances page.";
        }

        // Default General Educational Greeting / Guidance
        return "### Hello! I am the FinPath Educational Assistant.\n\n" +
                "I can help explain any of FinPath's features and financial planning principles:\n\n" +
                "- **Financial Goals**: How to calculate monthly targets and gap timelines.\n" +
                "- **Opportunity Discovery**: How to evaluate problem viability, fit scores, and customer validation.\n" +
                "- **Revenue Calculator**: Understanding CAC, break-even customer volume, and cost recovery.\n" +
                "- **Roadmaps**: Structuring customer interviews, MVPs, and pilot client launches.\n" +
                "- **Privacy & Data**: How your self-reported numbers are safely stored.\n\n" +
                "Try clicking one of the suggested prompts below, or ask a specific question!\n\n" +
                "> *Disclaimer: FinPath is an educational platform. I do not provide certified financial, legal, or tax advice, and projections do not guarantee business success or income.*";
    }

    private String callExternalAi(String prompt) {
        // Placeholder for optional external provider integration (e.g., OpenAI or Google Gemini).
        // If an API key is set in environment variables, an HTTP client call can be performed here.
        // Critical safeguard: ONLY the prompt string is passed; no user financial figures or secrets.
        return null; // Gracefully defers to local engine until external provider HTTP client is configured
    }

    private String anonymizeIp(String ip) {
        if (ip == null || ip.isBlank()) return "unknown";
        int lastDot = ip.lastIndexOf('.');
        if (lastDot > 0) return ip.substring(0, lastDot) + ".*";
        return "client";
    }

    private static class RequestCounter {
        long windowStart;
        int count;

        RequestCounter(long windowStart, int count) {
            this.windowStart = windowStart;
            this.count = count;
        }
    }
}
