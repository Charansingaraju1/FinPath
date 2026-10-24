package com.finpath.dto;

import java.math.BigDecimal;

public class RevenueCalculatorResult {
    private String scenarioName; // Conservative, Base, Optimistic
    private BigDecimal grossRevenue;
    private BigDecimal totalVariableCosts;
    private BigDecimal totalFixedCosts;
    private BigDecimal totalCustomerAcquisitionCost;
    private BigDecimal estimatedOperatingProfit;
    private Integer breakEvenCustomers;
    private Integer requiredLeads;
    private BigDecimal initialFundingRequired;
    private BigDecimal monthlyCashFlow;
    private BigDecimal costRecoveryPeriodMonths;
    private String feasibilityNotice;

    public RevenueCalculatorResult() {}

    public String getScenarioName() { return scenarioName; }
    public void setScenarioName(String scenarioName) { this.scenarioName = scenarioName; }

    public BigDecimal getGrossRevenue() { return grossRevenue; }
    public void setGrossRevenue(BigDecimal grossRevenue) { this.grossRevenue = grossRevenue; }

    public BigDecimal getTotalVariableCosts() { return totalVariableCosts; }
    public void setTotalVariableCosts(BigDecimal totalVariableCosts) { this.totalVariableCosts = totalVariableCosts; }

    public BigDecimal getTotalFixedCosts() { return totalFixedCosts; }
    public void setTotalFixedCosts(BigDecimal totalFixedCosts) { this.totalFixedCosts = totalFixedCosts; }

    public BigDecimal getTotalCustomerAcquisitionCost() { return totalCustomerAcquisitionCost; }
    public void setTotalCustomerAcquisitionCost(BigDecimal totalCustomerAcquisitionCost) { this.totalCustomerAcquisitionCost = totalCustomerAcquisitionCost; }

    public BigDecimal getEstimatedOperatingProfit() { return estimatedOperatingProfit; }
    public void setEstimatedOperatingProfit(BigDecimal estimatedOperatingProfit) { this.estimatedOperatingProfit = estimatedOperatingProfit; }

    public Integer getBreakEvenCustomers() { return breakEvenCustomers; }
    public void setBreakEvenCustomers(Integer breakEvenCustomers) { this.breakEvenCustomers = breakEvenCustomers; }

    public Integer getRequiredLeads() { return requiredLeads; }
    public void setRequiredLeads(Integer requiredLeads) { this.requiredLeads = requiredLeads; }

    public BigDecimal getInitialFundingRequired() { return initialFundingRequired; }
    public void setInitialFundingRequired(BigDecimal initialFundingRequired) { this.initialFundingRequired = initialFundingRequired; }

    public BigDecimal getMonthlyCashFlow() { return monthlyCashFlow; }
    public void setMonthlyCashFlow(BigDecimal monthlyCashFlow) { this.monthlyCashFlow = monthlyCashFlow; }

    public BigDecimal getCostRecoveryPeriodMonths() { return costRecoveryPeriodMonths; }
    public void setCostRecoveryPeriodMonths(BigDecimal costRecoveryPeriodMonths) { this.costRecoveryPeriodMonths = costRecoveryPeriodMonths; }

    public String getFeasibilityNotice() { return feasibilityNotice; }
    public void setFeasibilityNotice(String feasibilityNotice) { this.feasibilityNotice = feasibilityNotice; }
}
