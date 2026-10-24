package com.finpath.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "business_scenarios")
public class BusinessScenario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "opportunity_id")
    private Opportunity opportunity;

    @Column(nullable = false)
    private String name;

    @Column(name = "price_per_customer", nullable = false)
    private BigDecimal pricePerCustomer;

    @Column(name = "expected_customers", nullable = false)
    private Integer expectedCustomers;

    @Column(name = "variable_cost_per_customer", nullable = false)
    private BigDecimal variableCostPerCustomer = BigDecimal.ZERO;

    @Column(name = "monthly_fixed_expenses", nullable = false)
    private BigDecimal monthlyFixedExpenses = BigDecimal.ZERO;

    @Column(name = "initial_setup_costs", nullable = false)
    private BigDecimal initialSetupCosts = BigDecimal.ZERO;

    @Column(name = "customer_acquisition_cost", nullable = false)
    private BigDecimal customerAcquisitionCost = BigDecimal.ZERO;

    @Column(name = "qualified_leads", nullable = false)
    private Integer qualifiedLeads = 0;

    @Column(name = "conversion_rate", nullable = false)
    private BigDecimal conversionRate = new BigDecimal("0.0500");

    @Column(name = "gross_revenue", nullable = false)
    private BigDecimal grossRevenue = BigDecimal.ZERO;

    @Column(name = "operating_profit", nullable = false)
    private BigDecimal operatingProfit = BigDecimal.ZERO;

    @Column(name = "break_even_customers", nullable = false)
    private Integer breakEvenCustomers = 0;

    @Column(name = "required_leads", nullable = false)
    private Integer requiredLeads = 0;

    @Column(name = "cost_recovery_months", nullable = false)
    private BigDecimal costRecoveryMonths = BigDecimal.ZERO;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();

    public BusinessScenario() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Opportunity getOpportunity() { return opportunity; }
    public void setOpportunity(Opportunity opportunity) { this.opportunity = opportunity; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

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

    public BigDecimal getGrossRevenue() { return grossRevenue; }
    public void setGrossRevenue(BigDecimal grossRevenue) { this.grossRevenue = grossRevenue; }

    public BigDecimal getOperatingProfit() { return operatingProfit; }
    public void setOperatingProfit(BigDecimal operatingProfit) { this.operatingProfit = operatingProfit; }

    public Integer getBreakEvenCustomers() { return breakEvenCustomers; }
    public void setBreakEvenCustomers(Integer breakEvenCustomers) { this.breakEvenCustomers = breakEvenCustomers; }

    public Integer getRequiredLeads() { return requiredLeads; }
    public void setRequiredLeads(Integer requiredLeads) { this.requiredLeads = requiredLeads; }

    public BigDecimal getCostRecoveryMonths() { return costRecoveryMonths; }
    public void setCostRecoveryMonths(BigDecimal costRecoveryMonths) { this.costRecoveryMonths = costRecoveryMonths; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    @PreUpdate
    public void onUpdate() { this.updatedAt = LocalDateTime.now(); }
}
