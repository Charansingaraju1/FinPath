package com.finpath.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.List;

public class ChatRequest {

    @NotBlank(message = "Message must not be blank")
    @Size(max = 500, message = "Message must not exceed 500 characters")
    private String message;

    private List<ChatMessageDto> history;

    public ChatRequest() {}

    public ChatRequest(String message, List<ChatMessageDto> history) {
        this.message = message;
        this.history = history;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public List<ChatMessageDto> getHistory() {
        return history;
    }

    public void setHistory(List<ChatMessageDto> history) {
        this.history = history;
    }
}
