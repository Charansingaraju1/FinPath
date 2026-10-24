package com.finpath;

import com.finpath.dto.RevenueCalculatorRequest;
import com.finpath.dto.RevenueCalculatorResult;
import com.finpath.dto.ScenarioComparisonResult;
import com.finpath.service.RevenueCalculationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

class RevenueCalculationServiceTest {

    private RevenueCalculationService revenueService;

    @BeforeEach
    void setUp() {
        revenueService = new RevenueCalculationService();
    }

    @Test
    @DisplayName("Should correctly calculate base scenario gross revenue, operating profit, and break-even")
    void testCalculateBaseScenario() {
        RevenueCalculatorRequest req = new RevenueCalculatorRequest();
        req.setPricePerCustomer(new BigDecimal("500.00"));
        req.setExpectedCustomers(10);
        req.setVariableCostPerCustomer(new BigDecimal("50.00"));
        req.setMonthlyFixedExpenses(new BigDecimal("1000.00"));
        req.setInitialSetupCosts(new BigDecimal("2000.00"));
        req.setCustomerAcquisitionCost(new BigDecimal("50.00"));
        req.setConversionRate(new BigDecimal("0.05"));

        RevenueCalculatorResult result = revenueService.calculateScenario(req, "Base", 1.0, 1.0, 1.0);

        // Gross = 500 * 10 = 5000
        assertEquals(new BigDecimal("5000.00"), result.getGrossRevenue());
        // Variable = 50 * 10 = 500
        assertEquals(new BigDecimal("500.00"), result.getTotalVariableCosts());
        // Fixed = 1000
        assertEquals(new BigDecimal("1000.00"), result.getTotalFixedCosts());
        // Total CAC = 50 * 10 = 500
        assertEquals(new BigDecimal("500.00"), result.getTotalCustomerAcquisitionCost());
        // Operating profit = 5000 - 500 - 1000 - 500 = 3000
        assertEquals(new BigDecimal("3000.00"), result.getEstimatedOperatingProfit());

        // Contribution margin = 500 - 50 - 50 = 400.
        // Break-even = ceil(1000 / 400) = 3 customers.
        assertEquals(3, result.getBreakEvenCustomers());

        // Required leads = ceil(10 / 0.05) = 200 leads.
        assertEquals(200, result.getRequiredLeads());

        // Initial setup = 2000. Operating profit > 0, so cost recovery = 2000 / 3000 = 0.7 months
        assertEquals(new BigDecimal("0.7"), result.getCostRecoveryPeriodMonths());
    }

    @Test
    @DisplayName("Should flag high-revenue business that is unprofitable due to high operating costs")
    void testHighRevenueHighCostScenario() {
        RevenueCalculatorRequest req = new RevenueCalculatorRequest();
        req.setPricePerCustomer(new BigDecimal("2000.00"));
        req.setExpectedCustomers(5); // 10,000 revenue
        req.setVariableCostPerCustomer(new BigDecimal("1500.00")); // 7,500
        req.setMonthlyFixedExpenses(new BigDecimal("3500.00")); // fixed 3,500
        req.setCustomerAcquisitionCost(new BigDecimal("300.00")); // 1,500
        req.setInitialSetupCosts(new BigDecimal("5000.00"));

        RevenueCalculatorResult result = revenueService.calculateScenario(req, "Base", 1.0, 1.0, 1.0);

        // Gross = 10,000
        // Variable = 7,500
        // Fixed = 3,500
        // CAC = 1,500
        // Profit = 10000 - 7500 - 3500 - 1500 = -2500
        assertEquals(new BigDecimal("-2500.00"), result.getEstimatedOperatingProfit());
        assertTrue(result.getFeasibilityNotice().contains("Negative operating profit"));
    }

    @Test
    @DisplayName("Should generate conservative, base, and optimistic comparison sets")
    void testCompareScenarios() {
        RevenueCalculatorRequest req = new RevenueCalculatorRequest();
        req.setPricePerCustomer(new BigDecimal("300.00"));
        req.setExpectedCustomers(10);
        req.setVariableCostPerCustomer(new BigDecimal("30.00"));
        req.setMonthlyFixedExpenses(new BigDecimal("600.00"));
        req.setInitialSetupCosts(new BigDecimal("1000.00"));
        req.setCustomerAcquisitionCost(new BigDecimal("20.00"));
        req.setConversionRate(new BigDecimal("0.05"));

        ScenarioComparisonResult comparison = revenueService.compareScenarios(req);
        assertNotNull(comparison.getConservative());
        assertNotNull(comparison.getBase());
        assertNotNull(comparison.getOptimistic());

        assertTrue(comparison.getOptimistic().getGrossRevenue().compareTo(comparison.getBase().getGrossRevenue()) > 0);
        assertTrue(comparison.getBase().getGrossRevenue().compareTo(comparison.getConservative().getGrossRevenue()) > 0);
    }
}
