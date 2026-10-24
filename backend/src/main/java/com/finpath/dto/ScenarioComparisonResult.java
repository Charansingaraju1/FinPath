package com.finpath.dto;

public class ScenarioComparisonResult {
    private RevenueCalculatorResult conservative;
    private RevenueCalculatorResult base;
    private RevenueCalculatorResult optimistic;
    private String disclaimer = "All figures are hypothetical projections based on user-entered assumptions. FinPath does not guarantee income or customer demand.";

    public ScenarioComparisonResult() {}

    public ScenarioComparisonResult(RevenueCalculatorResult conservative, RevenueCalculatorResult base, RevenueCalculatorResult optimistic) {
        this.conservative = conservative;
        this.base = base;
        this.optimistic = optimistic;
    }

    public RevenueCalculatorResult getConservative() { return conservative; }
    public void setConservative(RevenueCalculatorResult conservative) { this.conservative = conservative; }

    public RevenueCalculatorResult getBase() { return base; }
    public void setBase(RevenueCalculatorResult base) { this.base = base; }

    public RevenueCalculatorResult getOptimistic() { return optimistic; }
    public void setOptimistic(RevenueCalculatorResult optimistic) { this.optimistic = optimistic; }

    public String getDisclaimer() { return disclaimer; }
    public void setDisclaimer(String disclaimer) { this.disclaimer = disclaimer; }
}
