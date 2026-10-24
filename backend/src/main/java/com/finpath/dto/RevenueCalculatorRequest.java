package com.finpath.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import java.math.BigDecimal;

public class RevenueCalculatorRequest {
    @NotNull(message = "Price per customer is required")
    @PositiveOrZero(message = "Price must be zero or positive")
    private BigDecimal pricePerCustomer;

    @NotNull(message = "Expected customers count is required")
    @PositiveOrZero(message = "Expected customers must be zero or positive")
    private Integer expectedCustomers;

    @PositiveOrZero
    private BigDecimal variableCostPerCustomer = BigDecimal.ZERO;

    @PositiveOrZero
    private BigDecimal monthlyFixedExpenses = BigDecimal.ZERO;

    @PositiveOrZero
    private BigDecimal initialSetupCosts = BigDecimal.ZERO;

    @PositiveOrZero
    private BigDecimal customerAcquisitionCost = BigDecimal.ZERO;

    @PositiveOrZero
    private Integer qualifiedLeads = 0;

    @PositiveOrZero
    private BigDecimal conversionRate = new BigDecimal("0.05"); // 5% default

    private Long opportunityId;

    public RevenueCalculatorRequest() {}

    public BigDecimal getPricePerCustomer() { return pricePerCustomer; }
    public void setPricePerCustomer(BigDecimal pricePerCustomer) { this.pricePerCustomer = pricePerCustomer; }

    public Integer getExpectedCustomers() { return expectedCustomers; }
    public void setExpectedCustomers(Integer expectedCustomers) { this.expectedCustomers = expectedCustomers; }

    public BigDecimal getVariableCostPerCustomer() { return variableCostPerCustomer; }
    public void setVariableCostPerCustomer(BigDecimal variableCostPerCustomer) { this.variableCostPerCustomer = variableCostPerCustomer; }

    public BigDecimal getMonthlyFixedExpenses() { return monthlyFixedExpenses; }
    public void setMonthlyFixedExpenses(BigDecimal monthlyFixedExpenses) { this.monthlyFixedExpenses = monthlyFixedExpenses; }

    public BigDecimal getInitialSetupCosts() { return initialSetupCosts; }
    public void setInitialSetupCosts(BigDecimal initialSetupCosts) { this.initialSetupCosts = initialSetupCosts; }

    public BigDecimal getCustomerAcquisitionCost() { return customerAcquisitionCost; }
    public void setCustomerAcquisitionCost(BigDecimal customerAcquisitionCost) { this.customerAcquisitionCost = customerAcquisitionCost; }

    public Integer getQualifiedLeads() { return qualifiedLeads; }
    public void setQualifiedLeads(Integer qualifiedLeads) { this.qualifiedLeads = qualifiedLeads; }

    public BigDecimal getConversionRate() { return conversionRate; }
    public void setConversionRate(BigDecimal conversionRate) { this.conversionRate = conversionRate; }

    public Long getOpportunityId() { return opportunityId; }
    public void setOpportunityId(Long opportunityId) { this.opportunityId = opportunityId; }
}
