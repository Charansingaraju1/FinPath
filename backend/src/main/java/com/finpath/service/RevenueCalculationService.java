package com.finpath.service;

import com.finpath.dto.RevenueCalculatorRequest;
import com.finpath.dto.RevenueCalculatorResult;
import com.finpath.dto.ScenarioComparisonResult;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
public class RevenueCalculationService {

    public RevenueCalculatorResult calculateScenario(RevenueCalculatorRequest request, String scenarioName, double customerMultiplier, double costMultiplier, double conversionMultiplier) {
        RevenueCalculatorResult result = new RevenueCalculatorResult();
        result.setScenarioName(scenarioName);

        BigDecimal price = safe(request.getPricePerCustomer());
        int baseCustomers = request.getExpectedCustomers() != null ? request.getExpectedCustomers() : 0;
        int customers = Math.max(0, (int) Math.round(baseCustomers * customerMultiplier));

        BigDecimal varCostPerCust = safe(request.getVariableCostPerCustomer()).multiply(BigDecimal.valueOf(costMultiplier));
        BigDecimal fixedCosts = safe(request.getMonthlyFixedExpenses()).multiply(BigDecimal.valueOf(costMultiplier));
        BigDecimal setupCosts = safe(request.getInitialSetupCosts());
        BigDecimal cacPerCust = safe(request.getCustomerAcquisitionCost()).multiply(BigDecimal.valueOf(costMultiplier));
        BigDecimal convRate = safe(request.getConversionRate()).multiply(BigDecimal.valueOf(conversionMultiplier));
        if (convRate.compareTo(BigDecimal.ZERO) <= 0) {
            convRate = new BigDecimal("0.05");
        }

        // 1. Gross revenue
        BigDecimal grossRevenue = price.multiply(BigDecimal.valueOf(customers)).setScale(2, RoundingMode.HALF_UP);
        result.setGrossRevenue(grossRevenue);

        // 2. Variable costs
        BigDecimal totalVariableCosts = varCostPerCust.multiply(BigDecimal.valueOf(customers)).setScale(2, RoundingMode.HALF_UP);
        result.setTotalVariableCosts(totalVariableCosts);

        // 3. Fixed costs
        BigDecimal totalFixedCosts = fixedCosts.setScale(2, RoundingMode.HALF_UP);
        result.setTotalFixedCosts(totalFixedCosts);

        // 4. Total CAC
        BigDecimal totalCac = cacPerCust.multiply(BigDecimal.valueOf(customers)).setScale(2, RoundingMode.HALF_UP);
        result.setTotalCustomerAcquisitionCost(totalCac);

        // 5. Operating profit = Gross - Variable - Fixed - CAC
        BigDecimal operatingProfit = grossRevenue.subtract(totalVariableCosts).subtract(totalFixedCosts).subtract(totalCac).setScale(2, RoundingMode.HALF_UP);
        result.setEstimatedOperatingProfit(operatingProfit);

        // 6. Break-even customers
        // Contribution margin per customer = price - varCostPerCust - cacPerCust
        BigDecimal contributionMargin = price.subtract(varCostPerCust).subtract(cacPerCust);
        if (contributionMargin.compareTo(BigDecimal.ZERO) > 0 && fixedCosts.compareTo(BigDecimal.ZERO) > 0) {
            int breakEven = fixedCosts.divide(contributionMargin, 0, RoundingMode.CEILING).intValue();
            result.setBreakEvenCustomers(breakEven);
        } else if (fixedCosts.compareTo(BigDecimal.ZERO) <= 0) {
            result.setBreakEvenCustomers(0);
        } else {
            result.setBreakEvenCustomers(999999); // Unreachable with negative contribution margin
        }

        // 7. Required leads = customers / conversion rate
        if (customers > 0) {
            int requiredLeads = BigDecimal.valueOf(customers)
                    .divide(convRate, 0, RoundingMode.CEILING).intValue();
            result.setRequiredLeads(requiredLeads);
        } else {
            result.setRequiredLeads(0);
        }

        // 8. Initial funding required
        // setupCosts + max(0, fixed costs + totalCac - (gross - variable))
        BigDecimal monthlyDeficit = totalFixedCosts.add(totalCac).subtract(grossRevenue.subtract(totalVariableCosts));
        BigDecimal workingCapitalReserve = monthlyDeficit.compareTo(BigDecimal.ZERO) > 0 ? monthlyDeficit : BigDecimal.ZERO;
        BigDecimal initialFunding = setupCosts.add(workingCapitalReserve).setScale(2, RoundingMode.HALF_UP);
        result.setInitialFundingRequired(initialFunding);

        // 9. Monthly cash flow (approximates operating profit for cash business)
        result.setMonthlyCashFlow(operatingProfit);

        // 10. Cost recovery period (months)
        if (operatingProfit.compareTo(BigDecimal.ZERO) > 0 && initialFunding.compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal recoveryMonths = initialFunding.divide(operatingProfit, 1, RoundingMode.HALF_UP);
            result.setCostRecoveryPeriodMonths(recoveryMonths);
        } else if (initialFunding.compareTo(BigDecimal.ZERO) <= 0) {
            result.setCostRecoveryPeriodMonths(BigDecimal.ZERO);
        } else {
            result.setCostRecoveryPeriodMonths(BigDecimal.valueOf(999.0)); // Not recovered under current negative cash flow
        }

        // Feasibility notice
        if (operatingProfit.compareTo(BigDecimal.ZERO) > 0) {
            result.setFeasibilityNotice("Profitable under these assumptions. Focus on testing willingness to pay and validating lead conversion.");
        } else {
            result.setFeasibilityNotice("Negative operating profit. Consider increasing price per client, reducing fixed overhead, or improving acquisition efficiency.");
        }

        return result;
    }

    public ScenarioComparisonResult compareScenarios(RevenueCalculatorRequest request) {
        RevenueCalculatorResult conservative = calculateScenario(request, "Conservative", 0.70, 1.10, 0.75);
        RevenueCalculatorResult base = calculateScenario(request, "Base", 1.0, 1.0, 1.0);
        RevenueCalculatorResult optimistic = calculateScenario(request, "Optimistic", 1.40, 0.90, 1.25);

        return new ScenarioComparisonResult(conservative, base, optimistic);
    }

    private BigDecimal safe(BigDecimal val) {
        return val != null ? val : BigDecimal.ZERO;
    }
}
