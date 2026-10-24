package com.finpath.dto;

import java.math.BigDecimal;

public class FinancialCalculationResult {
    private BigDecimal monthlyTakeHomeIncome;
    private BigDecimal monthlyTotalExpenses;
    private BigDecimal monthlyEssentialExpenses;
    private BigDecimal monthlyDiscretionaryExpenses;
    private BigDecimal monthlyDebtRepayments;
    private BigDecimal monthlySurplus;
    private BigDecimal currentSavings;
    private BigDecimal availableStartupBudget;
    private boolean isDeficit;
    private GoalAssessmentDto activeGoalAssessment;

    public FinancialCalculationResult() {}

    public BigDecimal getMonthlyTakeHomeIncome() { return monthlyTakeHomeIncome; }
    public void setMonthlyTakeHomeIncome(BigDecimal monthlyTakeHomeIncome) { this.monthlyTakeHomeIncome = monthlyTakeHomeIncome; }

    public BigDecimal getMonthlyTotalExpenses() { return monthlyTotalExpenses; }
    public void setMonthlyTotalExpenses(BigDecimal monthlyTotalExpenses) { this.monthlyTotalExpenses = monthlyTotalExpenses; }

    public BigDecimal getMonthlyEssentialExpenses() { return monthlyEssentialExpenses; }
    public void setMonthlyEssentialExpenses(BigDecimal monthlyEssentialExpenses) { this.monthlyEssentialExpenses = monthlyEssentialExpenses; }

    public BigDecimal getMonthlyDiscretionaryExpenses() { return monthlyDiscretionaryExpenses; }
    public void setMonthlyDiscretionaryExpenses(BigDecimal monthlyDiscretionaryExpenses) { this.monthlyDiscretionaryExpenses = monthlyDiscretionaryExpenses; }

    public BigDecimal getMonthlyDebtRepayments() { return monthlyDebtRepayments; }
    public void setMonthlyDebtRepayments(BigDecimal monthlyDebtRepayments) { this.monthlyDebtRepayments = monthlyDebtRepayments; }

    public BigDecimal getMonthlySurplus() { return monthlySurplus; }
    public void setMonthlySurplus(BigDecimal monthlySurplus) { this.monthlySurplus = monthlySurplus; }

    public BigDecimal getCurrentSavings() { return currentSavings; }
    public void setCurrentSavings(BigDecimal currentSavings) { this.currentSavings = currentSavings; }

    public BigDecimal getAvailableStartupBudget() { return availableStartupBudget; }
    public void setAvailableStartupBudget(BigDecimal availableStartupBudget) { this.availableStartupBudget = availableStartupBudget; }

    public boolean isDeficit() { return isDeficit; }
    public void setDeficit(boolean deficit) { isDeficit = deficit; }

    public GoalAssessmentDto getActiveGoalAssessment() { return activeGoalAssessment; }
    public void setActiveGoalAssessment(GoalAssessmentDto activeGoalAssessment) { this.activeGoalAssessment = activeGoalAssessment; }
}
