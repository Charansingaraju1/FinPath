package com.finpath.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "financial_profiles")
public class FinancialProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "monthly_take_home_income", nullable = false)
    private BigDecimal monthlyTakeHomeIncome = BigDecimal.ZERO;

    @Column(name = "monthly_essential_expenses", nullable = false)
    private BigDecimal monthlyEssentialExpenses = BigDecimal.ZERO;

    @Column(name = "monthly_discretionary_expenses", nullable = false)
    private BigDecimal monthlyDiscretionaryExpenses = BigDecimal.ZERO;

    @Column(name = "monthly_debt_repayments", nullable = false)
    private BigDecimal monthlyDebtRepayments = BigDecimal.ZERO;

    @Column(name = "current_savings", nullable = false)
    private BigDecimal currentSavings = BigDecimal.ZERO;

    @Column(name = "other_recurring_income", nullable = false)
    private BigDecimal otherRecurringIncome = BigDecimal.ZERO;

    @Column(name = "available_startup_budget", nullable = false)
    private BigDecimal availableStartupBudget = BigDecimal.ZERO;

    @Column(name = "debt_included_in_expenses", nullable = false)
    private Boolean debtIncludedInExpenses = false;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();

    public FinancialProfile() {}

    public FinancialProfile(User user) {
        this.user = user;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public BigDecimal getMonthlyTakeHomeIncome() { return monthlyTakeHomeIncome; }
    public void setMonthlyTakeHomeIncome(BigDecimal monthlyTakeHomeIncome) { this.monthlyTakeHomeIncome = monthlyTakeHomeIncome != null ? monthlyTakeHomeIncome : BigDecimal.ZERO; }

    public BigDecimal getMonthlyEssentialExpenses() { return monthlyEssentialExpenses; }
    public void setMonthlyEssentialExpenses(BigDecimal monthlyEssentialExpenses) { this.monthlyEssentialExpenses = monthlyEssentialExpenses != null ? monthlyEssentialExpenses : BigDecimal.ZERO; }

    public BigDecimal getMonthlyDiscretionaryExpenses() { return monthlyDiscretionaryExpenses; }
    public void setMonthlyDiscretionaryExpenses(BigDecimal monthlyDiscretionaryExpenses) { this.monthlyDiscretionaryExpenses = monthlyDiscretionaryExpenses != null ? monthlyDiscretionaryExpenses : BigDecimal.ZERO; }

    public BigDecimal getMonthlyDebtRepayments() { return monthlyDebtRepayments; }
    public void setMonthlyDebtRepayments(BigDecimal monthlyDebtRepayments) { this.monthlyDebtRepayments = monthlyDebtRepayments != null ? monthlyDebtRepayments : BigDecimal.ZERO; }

    public BigDecimal getCurrentSavings() { return currentSavings; }
    public void setCurrentSavings(BigDecimal currentSavings) { this.currentSavings = currentSavings != null ? currentSavings : BigDecimal.ZERO; }

    public BigDecimal getOtherRecurringIncome() { return otherRecurringIncome; }
    public void setOtherRecurringIncome(BigDecimal otherRecurringIncome) { this.otherRecurringIncome = otherRecurringIncome != null ? otherRecurringIncome : BigDecimal.ZERO; }

    public BigDecimal getAvailableStartupBudget() { return availableStartupBudget; }
    public void setAvailableStartupBudget(BigDecimal availableStartupBudget) { this.availableStartupBudget = availableStartupBudget != null ? availableStartupBudget : BigDecimal.ZERO; }

    public Boolean getDebtIncludedInExpenses() { return debtIncludedInExpenses; }
    public void setDebtIncludedInExpenses(Boolean debtIncludedInExpenses) { this.debtIncludedInExpenses = debtIncludedInExpenses != null ? debtIncludedInExpenses : false; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    @PreUpdate
    public void onUpdate() { this.updatedAt = LocalDateTime.now(); }
}
