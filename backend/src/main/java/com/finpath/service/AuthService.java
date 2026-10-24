package com.finpath.service;

import com.finpath.dto.AuthResponse;
import com.finpath.dto.LoginRequest;
import com.finpath.dto.RegisterRequest;
import com.finpath.dto.UserDto;
import com.finpath.entity.FinancialGoal;
import com.finpath.entity.FinancialProfile;
import com.finpath.entity.User;
import com.finpath.entity.UserProfile;
import com.finpath.entity.UserSettings;
import com.finpath.exception.BadRequestException;
import com.finpath.repository.FinancialGoalRepository;
import com.finpath.repository.FinancialProfileRepository;
import com.finpath.repository.UserProfileRepository;
import com.finpath.repository.UserRepository;
import com.finpath.repository.UserSettingsRepository;
import com.finpath.security.JwtUtils;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final UserProfileRepository profileRepository;
    private final FinancialProfileRepository financialProfileRepository;
    private final FinancialGoalRepository goalRepository;
    private final UserSettingsRepository settingsRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    public AuthService(UserRepository userRepository,
                       UserProfileRepository profileRepository,
                       FinancialProfileRepository financialProfileRepository,
                       FinancialGoalRepository goalRepository,
                       UserSettingsRepository settingsRepository,
                       PasswordEncoder passwordEncoder,
                       JwtUtils jwtUtils) {
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
        this.financialProfileRepository = financialProfileRepository;
        this.goalRepository = goalRepository;
        this.settingsRepository = settingsRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("An account with this email already exists");
        }

        User user = new User();
        user.setEmail(request.getEmail().toLowerCase().trim());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        if ("admin@finpath.demo".equalsIgnoreCase(user.getEmail()) || user.getEmail().endsWith("@finpath.admin")) {
            user.setRole("ROLE_ADMIN");
        } else {
            user.setRole("ROLE_USER");
        }
        user = userRepository.save(user);

        UserProfile profile = new UserProfile(user);
        profile.setDisplayName(request.getDisplayName() != null && !request.getDisplayName().isBlank()
                ? request.getDisplayName().trim()
                : request.getEmail().split("@")[0]);
        profile.setOnboardingCompleted(false);
        profileRepository.save(profile);

        FinancialProfile financialProfile = new FinancialProfile(user);
        financialProfileRepository.save(financialProfile);

        UserSettings settings = new UserSettings(user);
        settingsRepository.save(settings);

        String token = jwtUtils.generateToken(user.getEmail(), user.getId(), user.getRole());
        UserDto userDto = new UserDto(user.getId(), user.getEmail(), user.getRole(), profile.getDisplayName(), false);

        return new AuthResponse(token, userDto);
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail().toLowerCase().trim())
                .orElseThrow(() -> new BadRequestException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new BadRequestException("Invalid email or password");
        }

        UserProfile profile = profileRepository.findByUserId(user.getId()).orElse(null);
        String displayName = profile != null && profile.getDisplayName() != null ? profile.getDisplayName() : user.getEmail();
        boolean onboardingDone = profile != null && Boolean.TRUE.equals(profile.getOnboardingCompleted());

        String token = jwtUtils.generateToken(user.getEmail(), user.getId(), user.getRole());
        UserDto userDto = new UserDto(user.getId(), user.getEmail(), user.getRole(), displayName, onboardingDone);

        return new AuthResponse(token, userDto);
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("User not found"));
    }

    @Transactional
    public AuthResponse getOrCreateDemoUser() {
        String email = "alex.chen@finpath.demo";
        String password = "password123";
        User user;
        if (!userRepository.existsByEmail(email)) {
            RegisterRequest req = new RegisterRequest();
            req.setEmail(email);
            req.setPassword(password);
            req.setDisplayName("Alex Chen");
            register(req);
        }
        user = userRepository.findByEmail(email).orElseThrow();

        // Ensure realistic Indian Rupee financial profile
        FinancialProfile finProfile = financialProfileRepository.findByUserId(user.getId()).orElse(null);
        if (finProfile != null && (finProfile.getMonthlyTakeHomeIncome() == null || finProfile.getMonthlyTakeHomeIncome().compareTo(new java.math.BigDecimal("10000")) < 0)) {
            finProfile.setMonthlyTakeHomeIncome(new java.math.BigDecimal("75000.00"));
            finProfile.setOtherRecurringIncome(new java.math.BigDecimal("5000.00"));
            finProfile.setMonthlyEssentialExpenses(new java.math.BigDecimal("32000.00"));
            finProfile.setMonthlyDiscretionaryExpenses(new java.math.BigDecimal("10000.00"));
            finProfile.setMonthlyDebtRepayments(new java.math.BigDecimal("6000.00"));
            finProfile.setDebtIncludedInExpenses(false);
            finProfile.setCurrentSavings(new java.math.BigDecimal("180000.00"));
            finProfile.setAvailableStartupBudget(new java.math.BigDecimal("35000.00"));
            financialProfileRepository.save(finProfile);
        }

        // Ensure realistic Indian Rupee active goal
        if (goalRepository.findByUserIdOrderByDeadlineAsc(user.getId()).isEmpty()) {
            FinancialGoal goal = new FinancialGoal();
            goal.setUser(user);
            goal.setTitle("Build Emergency & Business Launch Reserve");
            goal.setGoalType("EMERGENCY_FUND");
            goal.setTargetAmount(new java.math.BigDecimal("500000.00"));
            goal.setCurrentAllocated(new java.math.BigDecimal("180000.00"));
            goal.setDeadline(java.time.LocalDate.now().plusMonths(10));
            goal.setPriority("HIGH");
            goal.setCurrency("INR");
            goal.setStatus("ACTIVE");
            goalRepository.save(goal);
        }

        // Mark onboarding completed for demo user
        UserProfile profile = profileRepository.findByUserId(user.getId()).orElse(null);
        if (profile != null && !Boolean.TRUE.equals(profile.getOnboardingCompleted())) {
            profile.setOnboardingCompleted(true);
            profileRepository.save(profile);
        }

        LoginRequest req = new LoginRequest();
        req.setEmail(email);
        req.setPassword(password);
        return login(req);
    }

    @Transactional
    public AuthResponse getOrCreateAdminUser() {
        String email = "admin@finpath.demo";
        String password = "password123";
        if (!userRepository.existsByEmail(email)) {
            RegisterRequest req = new RegisterRequest();
            req.setEmail(email);
            req.setPassword(password);
            req.setDisplayName("Platform Administrator");
            return register(req);
        }
        LoginRequest req = new LoginRequest();
        req.setEmail(email);
        req.setPassword(password);
        return login(req);
    }
}
