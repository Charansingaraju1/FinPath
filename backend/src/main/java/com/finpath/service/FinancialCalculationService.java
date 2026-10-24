package com.finpath.service;

import com.finpath.dto.FinancialCalculationResult;
import com.finpath.dto.GoalAssessmentDto;
import com.finpath.entity.FinancialGoal;
import com.finpath.entity.FinancialProfile;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

@Service
public class FinancialCalculationService {

    /**
     * Calculate monthly surplus:
     * Take-home income + other recurring income - (essential expenses + discretionary expenses + debt repayments if not already included)
     */
    public BigDecimal calculateMonthlySurplus(FinancialProfile profile) {
        if (profile == null) {
            return BigDecimal.ZERO;
        }

        BigDecimal income = safe(profile.getMonthlyTakeHomeIncome()).add(safe(profile.getOtherRecurringIncome()));
        BigDecimal expenses = safe(profile.getMonthlyEssentialExpenses())
                .add(safe(profile.getMonthlyDiscretionaryExpenses()));

        if (!Boolean.TRUE.equals(profile.getDebtIncludedInExpenses())) {
            expenses = expenses.add(safe(profile.getMonthlyDebtRepayments()));
        }

        return income.subtract(expenses);
    }

    /**
     * Calculate remaining goal gap:
     * max(0, target amount - amount already allocated)
     */
    public BigDecimal calculateRemainingGoalGap(FinancialGoal goal) {
        if (goal == null || goal.getTargetAmount() == null) {
            return BigDecimal.ZERO;
        }
        BigDecimal target = safe(goal.getTargetAmount());
        BigDecimal current = safe(goal.getCurrentAllocated());
        BigDecimal gap = target.subtract(current);
        return gap.compareTo(BigDecimal.ZERO) < 0 ? BigDecimal.ZERO : gap;
    }

    /**
     * Calculate remaining months until deadline.
     * Handles zero months, past deadlines safely.
     */
    public long calculateMonthsRemaining(LocalDate deadline, LocalDate currentDate) {
        if (deadline == null) return 1;
        LocalDate now = currentDate != null ? currentDate : LocalDate.now();
        if (deadline.isBefore(now) || deadline.isEqual(now)) {
            return 0;
        }
        long months = ChronoUnit.MONTHS.between(now, deadline);
        long days = ChronoUnit.DAYS.between(now.plusMonths(months), deadline);
        if (days > 15) {
            months += 1;
        }
        return Math.max(1, months);
    }

    /**
     * Calculate required monthly contribution:
     * remaining goal gap / months remaining
     */
    public BigDecimal calculateRequiredMonthlyContribution(BigDecimal remainingGap, long monthsRemaining) {
        if (remainingGap == null || remainingGap.compareTo(BigDecimal.ZERO) <= 0) {
            return BigDecimal.ZERO;
        }
        if (monthsRemaining <= 0) {
            return remainingGap; // past deadline or due immediately
        }
        return remainingGap.divide(BigDecimal.valueOf(monthsRemaining), 2, RoundingMode.HALF_UP);
    }

    /**
     * Assess whether a goal appears Achievable, Potentially Achievable, Unlikely, or Not Assessable.
     */
    public GoalAssessmentDto assessGoalFeasibility(FinancialProfile profile, FinancialGoal goal, LocalDate currentDate) {
        GoalAssessmentDto assessment = new GoalAssessmentDto();
        List<String> recommendations = new ArrayList<>();
        List<String> assumptions = new ArrayList<>();

        if (profile == null || goal == null || goal.getTargetAmount() == null) {
            assessment.setStatus("NOT_ASSESSABLE");
            assessment.setStatusLabel("Information Incomplete");
            assessment.setExplanation("Please complete your financial profile and set a target goal amount to assess feasibility.");
            assessment.setActionableRecommendations(List.of("Enter your income and expenses", "Set a target amount and deadline"));
            return assessment;
        }

        LocalDate now = currentDate != null ? currentDate : LocalDate.now();
        BigDecimal remainingGap = calculateRemainingGoalGap(goal);
        long months = calculateMonthsRemaining(goal.getDeadline(), now);
        BigDecimal surplus = calculateMonthlySurplus(profile);
        BigDecimal requiredMonthly = calculateRequiredMonthlyContribution(remainingGap, months);
        BigDecimal shortfallOrSurplus = surplus.subtract(requiredMonthly);

        assessment.setMonthlySurplus(surplus);
        assessment.setRequiredMonthlyContribution(requiredMonthly);
        assessment.setMonthlyShortfallOrSurplus(shortfallOrSurplus);
        assessment.setMonthsRemaining(months);
        assessment.setRemainingGap(remainingGap);

        assumptions.add("Calculations are based strictly on deterministic monthly cash-flow arithmetic.");
        assumptions.add("No speculative investment returns or stock market gains are assumed.");
        assumptions.add("Debt repayments and essential living costs are preserved as non-negotiable baselines.");

        if (goal.getDeadline() != null && goal.getDeadline().isBefore(now)) {
            assessment.setStatus("UNLIKELY");
            assessment.setStatusLabel("Deadline Has Passed");
            assessment.setExplanation("The target deadline for this goal has already elapsed. Consider extending the deadline to make it realistic.");
            recommendations.add("Update the goal deadline to allow a realistic contribution schedule.");
            recommendations.add("Allocate any existing liquid savings toward closing the current gap.");
        } else if (remainingGap.compareTo(BigDecimal.ZERO) <= 0) {
            assessment.setStatus("ACHIEVABLE");
            assessment.setStatusLabel("Goal Reached");
            assessment.setExplanation("Congratulations! You have already met or exceeded your target allocated amount.");
            recommendations.add("Maintain this reserve or allocate surplus to your next financial milestone.");
        } else if (surplus.compareTo(requiredMonthly) >= 0) {
            assessment.setStatus("ACHIEVABLE");
            assessment.setStatusLabel("Achievable Under Current Budget");
            assessment.setExplanation(String.format(
                    "Your current monthly surplus of ₹%s comfortably covers the required ₹%s/month contribution.",
                    surplus.toPlainString(), requiredMonthly.toPlainString()));
            recommendations.add(String.format("Set up an automatic monthly transfer of ₹%s towards this goal.", requiredMonthly.toPlainString()));
            recommendations.add("Direct any unexpected windfalls to reach your target ahead of schedule.");
        } else {
            BigDecimal discretionary = safe(profile.getMonthlyDiscretionaryExpenses());
            BigDecimal potentialSurplusWithCuts = surplus.add(discretionary);

            if (potentialSurplusWithCuts.compareTo(requiredMonthly) >= 0) {
                assessment.setStatus("POTENTIALLY_ACHIEVABLE");
                assessment.setStatusLabel("Achievable With Expense Adjustments");
                BigDecimal gapToClose = requiredMonthly.subtract(surplus);
                assessment.setExplanation(String.format(
                        "You currently fall short by ₹%s/month, but trimming discretionary spending by ₹%s or finding a small side service could close the gap.",
                        gapToClose.toPlainString(), gapToClose.toPlainString()));
                recommendations.add(String.format("Review discretionary expenses to free up ₹%s each month.", gapToClose.toPlainString()));
                recommendations.add("Explore practical micro-services matching your skills to earn supplemental income.");
            } else {
                assessment.setStatus("UNLIKELY");
                assessment.setStatusLabel("Requires Additional Income or Timeline Extension");
                BigDecimal monthlyGap = requiredMonthly.subtract(surplus);
                assessment.setExplanation(String.format(
                        "At your current timeline (%d months), you need an additional ₹%s/month beyond your current cash flow.",
                        months, monthlyGap.toPlainString()));
                recommendations.add("Explore opportunities on FinPath to generate sustainable extra income.");
                recommendations.add(String.format("Consider extending the deadline by %d to %d months to lower the monthly hurdle.",
                        months, months * 2));
                recommendations.add("Check if existing savings can be safely allocated without compromising your emergency fund.");
            }
        }

        assessment.setActionableRecommendations(recommendations);
        assessment.setAssumptions(assumptions);
        return assessment;
    }

    public FinancialCalculationResult calculateOverview(FinancialProfile profile, FinancialGoal activeGoal) {
        FinancialCalculationResult result = new FinancialCalculationResult();
        if (profile != null) {
            BigDecimal income = safe(profile.getMonthlyTakeHomeIncome()).add(safe(profile.getOtherRecurringIncome()));
            BigDecimal essential = safe(profile.getMonthlyEssentialExpenses());
            BigDecimal discretionary = safe(profile.getMonthlyDiscretionaryExpenses());
            BigDecimal debt = safe(profile.getMonthlyDebtRepayments());
            BigDecimal totalExpenses = essential.add(discretionary);
            if (!Boolean.TRUE.equals(profile.getDebtIncludedInExpenses())) {
                totalExpenses = totalExpenses.add(debt);
            }

            BigDecimal surplus = income.subtract(totalExpenses);

            result.setMonthlyTakeHomeIncome(income);
            result.setMonthlyEssentialExpenses(essential);
            result.setMonthlyDiscretionaryExpenses(discretionary);
            result.setMonthlyDebtRepayments(debt);
            result.setMonthlyTotalExpenses(totalExpenses);
            result.setMonthlySurplus(surplus);
            result.setDeficit(surplus.compareTo(BigDecimal.ZERO) < 0);
            result.setCurrentSavings(safe(profile.getCurrentSavings()));
            result.setAvailableStartupBudget(safe(profile.getAvailableStartupBudget()));
        } else {
            result.setMonthlyTakeHomeIncome(BigDecimal.ZERO);
            result.setMonthlyTotalExpenses(BigDecimal.ZERO);
            result.setMonthlyEssentialExpenses(BigDecimal.ZERO);
            result.setMonthlyDiscretionaryExpenses(BigDecimal.ZERO);
            result.setMonthlyDebtRepayments(BigDecimal.ZERO);
            result.setMonthlySurplus(BigDecimal.ZERO);
            result.setDeficit(false);
            result.setCurrentSavings(BigDecimal.ZERO);
            result.setAvailableStartupBudget(BigDecimal.ZERO);
        }

        if (activeGoal != null) {
            result.setActiveGoalAssessment(assessGoalFeasibility(profile, activeGoal, LocalDate.now()));
        }

        return result;
    }

    private BigDecimal safe(BigDecimal value) {
        return value != null ? value : BigDecimal.ZERO;
    }
}
