package com.finpath.dto;

public class UserDto {
    private Long id;
    private String email;
    private String role;
    private String displayName;
    private boolean onboardingCompleted;

    public UserDto() {}

    public UserDto(Long id, String email, String role, String displayName, boolean onboardingCompleted) {
        this.id = id;
        this.email = email;
        this.role = role;
        this.displayName = displayName;
        this.onboardingCompleted = onboardingCompleted;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getDisplayName() { return displayName; }
    public void setDisplayName(String displayName) { this.displayName = displayName; }

    public boolean isOnboardingCompleted() { return onboardingCompleted; }
    public void setOnboardingCompleted(boolean onboardingCompleted) { this.onboardingCompleted = onboardingCompleted; }
}
