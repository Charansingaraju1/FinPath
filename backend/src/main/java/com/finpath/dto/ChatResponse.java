package com.finpath.dto;

public class ChatResponse {
    private String reply;
    private String provider; // "local-rule-engine" or "external-ai"
    private String educationalNotice;
    private boolean externalAiConfigured;

    public ChatResponse() {}

    public ChatResponse(String reply, String provider, String educationalNotice, boolean externalAiConfigured) {
        this.reply = reply;
        this.provider = provider;
        this.educationalNotice = educationalNotice;
        this.externalAiConfigured = externalAiConfigured;
    }

    public String getReply() {
        return reply;
    }

    public void setReply(String reply) {
        this.reply = reply;
    }

    public String getProvider() {
        return provider;
    }

    public void setProvider(String provider) {
        this.provider = provider;
    }

    public String getEducationalNotice() {
        return educationalNotice;
    }

    public void setEducationalNotice(String educationalNotice) {
        this.educationalNotice = educationalNotice;
    }

    public boolean isExternalAiConfigured() {
        return externalAiConfigured;
    }

    public void setExternalAiConfigured(boolean externalAiConfigured) {
        this.externalAiConfigured = externalAiConfigured;
    }
}
