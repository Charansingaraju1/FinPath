package com.finpath.dto;

import jakarta.validation.constraints.Size;

public class ChatMessageDto {
    private String role; // "user" or "assistant"

    @Size(max = 500, message = "Content must not exceed 500 characters")
    private String content;

    public ChatMessageDto() {}

    public ChatMessageDto(String role, String content) {
        this.role = role;
        this.content = content;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
