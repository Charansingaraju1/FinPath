package com.finpath.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AiAssistantService {

    @Value("${finpath.ai.api-key:}")
    private String apiKey;

    public Map<String, Object> brainstormSolutions(String problemDescription, String targetCustomer) {
        Map<String, Object> response = new HashMap<>();
        response.put("notice", "AI suggestions are unverified brainstorming prompts. Please validate real customer demand before investing capital.");

        List<Map<String, String>> ideas = new ArrayList<>();
        ideas.add(Map.of(
                "title", "Done-For-You Implementation Service",
                "concept", "Package a high-touch service resolving this directly for " + (targetCustomer != null ? targetCustomer : "the client") + " with zero friction.",
                "initialCost", "₹3,500 - ₹15,000",
                "firstStep", "Interview 3 prospective customers to verify if they prefer outsourcing over self-serve software."
        ));
        ideas.add(Map.of(
                "title", "Lightweight Automated Workflow System",
                "concept", "Combine no-code or lightweight scripts to automate the recurring friction point.",
                "initialCost", "₹7,500 - ₹25,000",
                "firstStep", "Map out the exact sequence of 5 steps the customer executes manually today."
        ));
        ideas.add(Map.of(
                "title", "Educational Toolkit & Standard Operating Guide",
                "concept", "Create step-by-step checklists, templates, and video guides enabling clients to fix this affordably.",
                "initialCost", "₹0 - ₹3,500",
                "firstStep", "Test if prospective clients are searching for guides or asking in online community forums."
        ));

        response.put("suggestions", ideas);
        return response;
    }

    public Map<String, Object> generateInterviewQuestions(String problemTopic, String customerType) {
        Map<String, Object> response = new HashMap<>();
        response.put("notice", "Suggestions are exploratory discovery questions. Avoid leading questions or promising solutions during interviews.");

        List<String> questions = List.of(
                "1. Can you walk me through the last time you had to deal with " + (problemTopic != null ? problemTopic : "this challenge") + "?",
                "2. What makes this workflow particularly frustrating or time-consuming for you?",
                "3. What tools, spreadsheets, or workarounds do you currently use to handle this?",
                "4. How much time or revenue does your team lose when this process fails?",
                "5. What would an ideal, effortless solution look like to you in an average week?"
        );

        response.put("questions", questions);
        return response;
    }
}
