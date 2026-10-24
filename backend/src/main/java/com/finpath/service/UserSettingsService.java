package com.finpath.service;

import com.finpath.entity.User;
import com.finpath.entity.UserSettings;
import com.finpath.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

@Service
public class UserSettingsService {

    private final UserSettingsRepository settingsRepository;
    private final UserRepository userRepository;
    private final UserProfileRepository profileRepository;
    private final FinancialProfileRepository financialProfileRepository;
    private final FinancialGoalRepository goalRepository;
    private final TransactionRepository transactionRepository;

    public UserSettingsService(UserSettingsRepository settingsRepository,
                               UserRepository userRepository,
                               UserProfileRepository profileRepository,
                               FinancialProfileRepository financialProfileRepository,
                               FinancialGoalRepository goalRepository,
                               TransactionRepository transactionRepository) {
        this.settingsRepository = settingsRepository;
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
        this.financialProfileRepository = financialProfileRepository;
        this.goalRepository = goalRepository;
        this.transactionRepository = transactionRepository;
    }

    public UserSettings getSettings(User user) {
        return settingsRepository.findByUserId(user.getId())
                .orElseGet(() -> settingsRepository.save(new UserSettings(user)));
    }

    @Transactional
    public UserSettings updateSettings(User user, String theme, Boolean emailNotifications, Boolean privacyMode) {
        UserSettings settings = getSettings(user);
        if (theme != null) settings.setTheme(theme);
        if (emailNotifications != null) settings.setEmailNotifications(emailNotifications);
        if (privacyMode != null) settings.setPrivacyMode(privacyMode);
        return settingsRepository.save(settings);
    }

    public Map<String, Object> exportUserData(User user) {
        Map<String, Object> data = new HashMap<>();
        data.put("user", Map.of("id", user.getId(), "email", user.getEmail(), "createdAt", user.getCreatedAt()));
        data.put("profile", profileRepository.findByUserId(user.getId()).orElse(null));
        data.put("financialProfile", financialProfileRepository.findByUserId(user.getId()).orElse(null));
        data.put("goals", goalRepository.findByUserIdOrderByDeadlineAsc(user.getId()));
        data.put("transactions", transactionRepository.findByUserIdOrderByTransactionDateDescCreatedAtDesc(user.getId()));
        data.put("settings", getSettings(user));
        return data;
    }

    @Transactional
    public void deleteAccount(User user) {
        userRepository.delete(user);
    }
}
