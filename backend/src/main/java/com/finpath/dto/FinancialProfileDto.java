package com.finpath.dto;

import java.math.BigDecimal;

public class FinancialProfileDto {
    private BigDecimal monthlyTakeHomeIncome;
    private BigDecimal monthlyEssentialExpenses;
    private BigDecimal monthlyDiscretionaryExpenses;
    private BigDecimal monthlyDebtRepayments;
    private BigDecimal currentSavings;
    private BigDecimal otherRecurringIncome;
    private BigDecimal availableStartupBudget;
    private Boolean debtIncludedInExpenses;

    public FinancialProfileDto() {}

    public BigDecimal getMonthlyTakeHomeIncome() { return monthlyTakeHomeIncome; }
    public void setMonthlyTakeHomeIncome(BigDecimal monthlyTakeHomeIncome) { this.monthlyTakeHomeIncome = monthlyTakeHomeIncome; }

    public BigDecimal getMonthlyEssentialExpenses() { return monthlyEssentialExpenses; }
    public void setMonthlyEssentialExpenses(BigDecimal monthlyEssentialExpenses) { this.monthlyEssentialExpenses = monthlyEssentialExpenses; }

    public BigDecimal getMonthlyDiscretionaryExpenses() { return monthlyDiscretionaryExpenses; }
    public void setMonthlyDiscretionaryExpenses(BigDecimal monthlyDiscretionaryExpenses) { this.monthlyDiscretionaryExpenses = monthlyDiscretionaryExpenses; }

    public BigDecimal getMonthlyDebtRepayments() { return monthlyDebtRepayments; }
    public void setMonthlyDebtRepayments(BigDecimal monthlyDebtRepayments) { this.monthlyDebtRepayments = monthlyDebtRepayments; }

    public BigDecimal getCurrentSavings() { return currentSavings; }
    public void setCurrentSavings(BigDecimal currentSavings) { this.currentSavings = currentSavings; }

    public BigDecimal getOtherRecurringIncome() { return otherRecurringIncome; }
    public void setOtherRecurringIncome(BigDecimal otherRecurringIncome) { this.otherRecurringIncome = otherRecurringIncome; }

    public BigDecimal getAvailableStartupBudget() { return availableStartupBudget; }
    public void setAvailableStartupBudget(BigDecimal availableStartupBudget) { this.availableStartupBudget = availableStartupBudget; }

    public Boolean getDebtIncludedInExpenses() { return debtIncludedInExpenses; }
    public void setDebtIncludedInExpenses(Boolean debtIncludedInExpenses) { this.debtIncludedInExpenses = debtIncludedInExpenses; }
}
