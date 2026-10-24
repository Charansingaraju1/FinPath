package com.finpath;

import com.finpath.dto.GoalAssessmentDto;
import com.finpath.entity.FinancialGoal;
import com.finpath.entity.FinancialProfile;
import com.finpath.service.FinancialCalculationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;

class FinancialCalculationServiceTest {

    private FinancialCalculationService calculationService;

    @BeforeEach
    void setUp() {
        calculationService = new FinancialCalculationService();
    }

    @Test
    @DisplayName("Should correctly calculate monthly surplus when income exceeds expenses")
    void testCalculateMonthlySurplus_Positive() {
        FinancialProfile profile = new FinancialProfile();
        profile.setMonthlyTakeHomeIncome(new BigDecimal("4000.00"));
        profile.setOtherRecurringIncome(new BigDecimal("200.00"));
        profile.setMonthlyEssentialExpenses(new BigDecimal("2200.00"));
        profile.setMonthlyDiscretionaryExpenses(new BigDecimal("600.00"));
        profile.setMonthlyDebtRepayments(new BigDecimal("300.00"));
        profile.setDebtIncludedInExpenses(false);

        BigDecimal surplus = calculationService.calculateMonthlySurplus(profile);
        // 4200 - (2200 + 600 + 300) = 4200 - 3100 = 1100
        assertEquals(new BigDecimal("1100.00"), surplus);
    }

    @Test
    @DisplayName("Should not double-count debt when debt is already marked as included in expenses")
    void testCalculateMonthlySurplus_DebtAlreadyIncluded() {
        FinancialProfile profile = new FinancialProfile();
        profile.setMonthlyTakeHomeIncome(new BigDecimal("3000.00"));
        profile.setOtherRecurringIncome(BigDecimal.ZERO);
        profile.setMonthlyEssentialExpenses(new BigDecimal("2000.00"));
        profile.setMonthlyDiscretionaryExpenses(new BigDecimal("400.00"));
        profile.setMonthlyDebtRepayments(new BigDecimal("500.00"));
        profile.setDebtIncludedInExpenses(true); // already in essential

        BigDecimal surplus = calculationService.calculateMonthlySurplus(profile);
        // 3000 - 2400 = 600
        assertEquals(new BigDecimal("600.00"), surplus);
    }

    @Test
    @DisplayName("Should safely handle null or zero profile without throwing exception")
    void testCalculateMonthlySurplus_NullProfile() {
        BigDecimal surplus = calculationService.calculateMonthlySurplus(null);
        assertEquals(BigDecimal.ZERO, surplus);
    }

    @Test
    @DisplayName("Should correctly identify monthly deficit when expenses exceed income")
    void testCalculateMonthlySurplus_Deficit() {
        FinancialProfile profile = new FinancialProfile();
        profile.setMonthlyTakeHomeIncome(new BigDecimal("2000.00"));
        profile.setMonthlyEssentialExpenses(new BigDecimal("1800.00"));
        profile.setMonthlyDiscretionaryExpenses(new BigDecimal("500.00"));
        profile.setDebtIncludedInExpenses(true);

        BigDecimal surplus = calculationService.calculateMonthlySurplus(profile);
        // 2000 - 2300 = -300
        assertEquals(new BigDecimal("-300.00"), surplus);
    }

    @Test
    @DisplayName("Should calculate remaining goal gap correctly")
    void testCalculateRemainingGoalGap() {
        FinancialGoal goal = new FinancialGoal();
        goal.setTargetAmount(new BigDecimal("10000.00"));
        goal.setCurrentAllocated(new BigDecimal("3500.00"));

        BigDecimal gap = calculationService.calculateRemainingGoalGap(goal);
        assertEquals(new BigDecimal("6500.00"), gap);
    }

    @Test
    @DisplayName("Should return 0 for remaining gap if current allocated exceeds target")
    void testCalculateRemainingGoalGap_Overfunded() {
        FinancialGoal goal = new FinancialGoal();
        goal.setTargetAmount(new BigDecimal("5000.00"));
        goal.setCurrentAllocated(new BigDecimal("6000.00"));

        BigDecimal gap = calculationService.calculateRemainingGoalGap(goal);
        assertEquals(BigDecimal.ZERO, gap);
    }

    @Test
    @DisplayName("Should calculate required monthly contribution accurately")
    void testCalculateRequiredMonthlyContribution() {
        BigDecimal gap = new BigDecimal("6000.00");
        long monthsRemaining = 6;

        BigDecimal monthly = calculationService.calculateRequiredMonthlyContribution(gap, monthsRemaining);
        assertEquals(new BigDecimal("1000.00"), monthly);
    }

    @Test
    @DisplayName("Should assess goal as ACHIEVABLE when surplus exceeds required contribution")
    void testAssessGoalFeasibility_Achievable() {
        LocalDate now = LocalDate.of(2026, 1, 1);
        FinancialProfile profile = new FinancialProfile();
        profile.setMonthlyTakeHomeIncome(new BigDecimal("4000.00"));
        profile.setMonthlyEssentialExpenses(new BigDecimal("2000.00"));
        profile.setMonthlyDiscretionaryExpenses(new BigDecimal("500.00"));
        profile.setDebtIncludedInExpenses(true); // surplus = 1500

        FinancialGoal goal = new FinancialGoal();
        goal.setTargetAmount(new BigDecimal("6000.00"));
        goal.setCurrentAllocated(BigDecimal.ZERO);
        goal.setDeadline(LocalDate.of(2026, 7, 1)); // 6 months, req = 1000/mo

        GoalAssessmentDto assessment = calculationService.assessGoalFeasibility(profile, goal, now);
        assertEquals("ACHIEVABLE", assessment.getStatus());
        assertTrue(assessment.getMonthlySurplus().compareTo(assessment.getRequiredMonthlyContribution()) >= 0);
    }

    @Test
    @DisplayName("Should assess goal as POTENTIALLY_ACHIEVABLE when discretionary cuts can bridge the gap")
    void testAssessGoalFeasibility_PotentiallyAchievable() {
        LocalDate now = LocalDate.of(2026, 1, 1);
        FinancialProfile profile = new FinancialProfile();
        profile.setMonthlyTakeHomeIncome(new BigDecimal("3000.00"));
        profile.setMonthlyEssentialExpenses(new BigDecimal("2200.00"));
        profile.setMonthlyDiscretionaryExpenses(new BigDecimal("600.00"));
        profile.setDebtIncludedInExpenses(true); // surplus = 200, but discretionary is 600 (potential = 800)

        FinancialGoal goal = new FinancialGoal();
        goal.setTargetAmount(new BigDecimal("3000.00"));
        goal.setCurrentAllocated(BigDecimal.ZERO);
        goal.setDeadline(LocalDate.of(2026, 7, 1)); // 6 months => req = 500/mo (500 > 200 surplus, but 500 <= 800)

        GoalAssessmentDto assessment = calculationService.assessGoalFeasibility(profile, goal, now);
        assertEquals("POTENTIALLY_ACHIEVABLE", assessment.getStatus());
    }

    @Test
    @DisplayName("Should assess goal as UNLIKELY and handle past deadlines safely")
    void testAssessGoalFeasibility_PastDeadline() {
        LocalDate now = LocalDate.of(2026, 6, 1);
        FinancialProfile profile = new FinancialProfile();
        profile.setMonthlyTakeHomeIncome(new BigDecimal("3000.00"));

        FinancialGoal goal = new FinancialGoal();
        goal.setTargetAmount(new BigDecimal("5000.00"));
        goal.setCurrentAllocated(new BigDecimal("1000.00"));
        goal.setDeadline(LocalDate.of(2025, 12, 1)); // Past!

        GoalAssessmentDto assessment = calculationService.assessGoalFeasibility(profile, goal, now);
        assertEquals("UNLIKELY", assessment.getStatus());
        assertEquals("Deadline Has Passed", assessment.getStatusLabel());
    }

    @Test
    @DisplayName("Should assess incomplete info as NOT_ASSESSABLE")
    void testAssessGoalFeasibility_IncompleteData() {
        GoalAssessmentDto assessment = calculationService.assessGoalFeasibility(null, null, LocalDate.now());
        assertEquals("NOT_ASSESSABLE", assessment.getStatus());
    }

    @Test
    @DisplayName("Should safely handle null goal deadline without NullPointerException")
    void testAssessGoalFeasibility_NullDeadline() {
        FinancialProfile profile = new FinancialProfile();
        profile.setMonthlyTakeHomeIncome(new BigDecimal("5000.00"));
        profile.setMonthlyEssentialExpenses(new BigDecimal("2000.00"));

        FinancialGoal goal = new FinancialGoal();
        goal.setTargetAmount(new BigDecimal("10000.00"));
        goal.setCurrentAllocated(BigDecimal.ZERO);
        goal.setDeadline(null); // null deadline

        GoalAssessmentDto assessment = calculationService.assessGoalFeasibility(profile, goal, LocalDate.now());
        assertNotNull(assessment);
        assertNotEquals("NOT_ASSESSABLE", assessment.getStatus());
    }
}
