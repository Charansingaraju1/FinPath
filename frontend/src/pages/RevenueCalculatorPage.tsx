import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { ScenarioComparison } from '../types';
import { formatCurrency } from '../utils/formatters';
import {
  Calculator,
  Sparkles,
  Sliders,
  ShieldAlert
} from 'lucide-react';

export const RevenueCalculatorPage: React.FC = () => {
  // Inputs calibrated in INR
  const [price, setPrice] = useState<number>(15000);
  const [customers, setCustomers] = useState<number>(10);
  const [variableCost, setVariableCost] = useState<number>(1500);
  const [fixedExpenses, setFixedExpenses] = useState<number>(5000);
  const [setupCosts, setSetupCosts] = useState<number>(25000);
  const [cac, setCac] = useState<number>(1000);
  const [conversionRate, setConversionRate] = useState<number>(0.05);

  const [comparison, setComparison] = useState<ScenarioComparison | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let ignore = false;
    const recalculate = async () => {
      setLoading(true);
      try {
        const res = await api.calculateRevenueScenarios({
          pricePerCustomer: price,
          expectedCustomers: customers,
          variableCostPerCustomer: variableCost,
          monthlyFixedExpenses: fixedExpenses,
          initialSetupCosts: setupCosts,
          customerAcquisitionCost: cac,
          conversionRate,
        });
        if (!ignore) {
          setComparison(res);
        }
      } catch (err) {
        console.error('Error calculating scenarios:', err);
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };
    recalculate();
    return () => {
      ignore = true;
    };
  }, [price, customers, variableCost, fixedExpenses, setupCosts, cac, conversionRate]);

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-left space-y-8">
      {/* Page Title */}
      <div className="pb-4 border-b border-[#E5D8CB]">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F4E2D9] text-xs font-semibold text-[#9E3529] mb-2">
          <Calculator className="w-3.5 h-3.5" />
          FEASIBILITY & UNIT ECONOMICS
          {loading && <span className="ml-1 text-[10px] animate-pulse font-normal">(calculating...)</span>}
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#49362E]">
          Revenue & Feasibility Calculator
        </h1>
        <p className="text-sm sm:text-base text-[#79675E] mt-1 max-w-3xl">
          Test your assumptions dynamically. See how price point, acquisition cost, and overhead impact break-even thresholds and monthly cash flow.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Editable Sliders & Inputs */}
        <div className="lg:col-span-5 bg-[#FFF9F1] rounded-3xl p-6 sm:p-7 border border-[#E5D8CB] shadow-soft space-y-5">
          <h2 className="font-display text-xl font-bold text-[#49362E] flex items-center gap-2">
            <Sliders className="w-5 h-5 text-[#C74634]" />
            Model Assumptions
          </h2>

          {/* 1. Price */}
          <div>
            <div className="flex justify-between text-xs font-bold text-[#49362E] mb-1">
              <span>Price Per Customer / Deliverable</span>
              <span className="text-[#C74634] text-sm">{formatCurrency(price)}</span>
            </div>
            <input
              type="range"
              min="1000"
              max="100000"
              step="500"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full accent-[#C74634] cursor-pointer"
            />
          </div>

          {/* 2. Expected Customers */}
          <div>
            <div className="flex justify-between text-xs font-bold text-[#49362E] mb-1">
              <span>Expected Customers / Month</span>
              <span className="text-[#C74634] text-sm">{customers} clients</span>
            </div>
            <input
              type="range"
              min="1"
              max="50"
              step="1"
              value={customers}
              onChange={(e) => setCustomers(Number(e.target.value))}
              className="w-full accent-[#C74634] cursor-pointer"
            />
          </div>

          {/* 3. Variable Cost per Customer */}
          <div>
            <div className="flex justify-between text-xs font-bold text-[#49362E] mb-1">
              <span>Variable Cost Per Customer</span>
              <span className="text-[#49362E]">{formatCurrency(variableCost)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="15000"
              step="250"
              value={variableCost}
              onChange={(e) => setVariableCost(Number(e.target.value))}
              className="w-full accent-[#C74634] cursor-pointer"
            />
            <span className="text-[10px] text-[#79675E]">Hosting, materials, third-party API usage</span>
          </div>

          {/* 4. Monthly Fixed Expenses */}
          <div>
            <div className="flex justify-between text-xs font-bold text-[#49362E] mb-1">
              <span>Monthly Fixed Overhead</span>
              <span className="text-[#49362E]">{formatCurrency(fixedExpenses)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="50000"
              step="500"
              value={fixedExpenses}
              onChange={(e) => setFixedExpenses(Number(e.target.value))}
              className="w-full accent-[#C74634] cursor-pointer"
            />
            <span className="text-[10px] text-[#79675E]">Software subscriptions, phone/internet, accounting</span>
          </div>

          {/* 5. Customer Acquisition Cost (CAC) */}
          <div>
            <div className="flex justify-between text-xs font-bold text-[#49362E] mb-1">
              <span>Acquisition Cost Per Client (CAC)</span>
              <span className="text-[#49362E]">{formatCurrency(cac)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="10000"
              step="100"
              value={cac}
              onChange={(e) => setCac(Number(e.target.value))}
              className="w-full accent-[#C74634] cursor-pointer"
            />
          </div>

          {/* 6. Initial Setup Costs */}
          <div>
            <div className="flex justify-between text-xs font-bold text-[#49362E] mb-1">
              <span>Initial Setup & Launch Costs</span>
              <span className="text-[#49362E]">{formatCurrency(setupCosts)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="200000"
              step="1000"
              value={setupCosts}
              onChange={(e) => setSetupCosts(Number(e.target.value))}
              className="w-full accent-[#C74634] cursor-pointer"
            />
            <span className="text-[10px] text-[#79675E]">Domain, registration, branding, starter gear</span>
          </div>

          {/* 7. Lead Conversion Rate */}
          <div>
            <div className="flex justify-between text-xs font-bold text-[#49362E] mb-1">
              <span>Expected Lead-to-Client Conversion</span>
              <span className="text-[#49362E]">{(conversionRate * 100).toFixed(1)}%</span>
            </div>
            <select
              value={conversionRate}
              onChange={(e) => setConversionRate(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-[#E5D8CB] bg-white text-xs text-[#49362E]"
            >
              <option value={0.02}>2.0% (Cold outreach / high friction)</option>
              <option value={0.05}>5.0% (Warm outreach / targeted)</option>
              <option value={0.10}>10.0% (Referrals / high trust)</option>
              <option value={0.15}>15.0% (Existing network pilot)</option>
            </select>
          </div>
        </div>

        {/* Right Column: Scenario Comparison Cards & Key Insights */}
        <div className="lg:col-span-7 space-y-6">
          {comparison && (
            <>
              {/* 3 Comparative Scenario Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 1: Conservative */}
                <div className="bg-[#FFF9F1] rounded-2xl p-5 border border-[#E5D8CB] shadow-soft space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#79675E]">
                      Conservative
                    </span>
                    <span className="text-[10px] font-semibold text-[#79675E] bg-[#F4E2D9] px-2 py-0.5 rounded">
                      -30% clients
                    </span>
                  </div>
                  <div className="text-xl font-bold font-display text-[#49362E]">
                    {formatCurrency(comparison.conservative.grossRevenue)}
                    <span className="text-xs font-normal text-[#79675E] block">Gross Revenue / mo</span>
                  </div>
                  <div className="pt-2 border-t border-[#E5D8CB] text-xs space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-[#79675E]">Operating Profit:</span>
                      <strong className={comparison.conservative.estimatedOperatingProfit >= 0 ? 'text-[#356B4B]' : 'text-[#9E3529]'}>
                        {formatCurrency(comparison.conservative.estimatedOperatingProfit)}
                      </strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#79675E]">Break-Even:</span>
                      <strong>{comparison.conservative.breakEvenCustomers} clients</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#79675E]">Required Leads:</span>
                      <strong>{comparison.conservative.requiredLeads}</strong>
                    </div>
                  </div>
                </div>

                {/* 2: Base (Primary Highlight) */}
                <div className="bg-[#FFF9F1] rounded-2xl p-5 border-2 border-[#C74634] shadow-warm space-y-3 relative">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#C74634] text-white text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                    Target Base
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#C74634]">
                      Base Plan
                    </span>
                    <span className="text-[10px] font-semibold text-[#356B4B] bg-[#DCE8DE] px-2 py-0.5 rounded">
                      100% assumption
                    </span>
                  </div>
                  <div className="text-2xl font-bold font-display text-[#C74634]">
                    {formatCurrency(comparison.base.grossRevenue)}
                    <span className="text-xs font-normal text-[#79675E] block">Gross Revenue / mo</span>
                  </div>
                  <div className="pt-2 border-t border-[#E5D8CB] text-xs space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-[#79675E]">Operating Profit:</span>
                      <strong className={comparison.base.estimatedOperatingProfit >= 0 ? 'text-[#356B4B]' : 'text-[#9E3529]'}>
                        {formatCurrency(comparison.base.estimatedOperatingProfit)}
                      </strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#79675E]">Break-Even:</span>
                      <strong>{comparison.base.breakEvenCustomers} clients</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#79675E]">Required Leads:</span>
                      <strong>{comparison.base.requiredLeads}</strong>
                    </div>
                  </div>
                </div>

                {/* 3: Optimistic */}
                <div className="bg-[#FFF9F1] rounded-2xl p-5 border border-[#E5D8CB] shadow-soft space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#79675E]">
                      Optimistic
                    </span>
                    <span className="text-[10px] font-semibold text-[#356B4B] bg-[#DCE8DE] px-2 py-0.5 rounded">
                      +40% clients
                    </span>
                  </div>
                  <div className="text-xl font-bold font-display text-[#49362E]">
                    {formatCurrency(comparison.optimistic.grossRevenue)}
                    <span className="text-xs font-normal text-[#79675E] block">Gross Revenue / mo</span>
                  </div>
                  <div className="pt-2 border-t border-[#E5D8CB] text-xs space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-[#79675E]">Operating Profit:</span>
                      <strong className={comparison.optimistic.estimatedOperatingProfit >= 0 ? 'text-[#356B4B]' : 'text-[#9E3529]'}>
                        {formatCurrency(comparison.optimistic.estimatedOperatingProfit)}
                      </strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#79675E]">Break-Even:</span>
                      <strong>{comparison.optimistic.breakEvenCustomers} clients</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#79675E]">Required Leads:</span>
                      <strong>{comparison.optimistic.requiredLeads}</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Detailed Economics Breakdown (Base Plan) */}
              <div className="bg-[#FFF9F1] rounded-3xl p-6 border border-[#E5D8CB] shadow-soft space-y-4">
                <h3 className="font-display text-lg font-bold text-[#49362E]">
                  Base Plan Unit Economics & Capital Recovery
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-white border border-[#E5D8CB] text-xs">
                  <div>
                    <span className="text-[#79675E] block">Initial Funding Required:</span>
                    <strong className="text-base text-[#49362E] font-display">
                      {formatCurrency(comparison.base.initialFundingRequired)}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[#79675E] block">Break-Even Clients:</span>
                    <strong className="text-base text-[#C74634] font-display">
                      {comparison.base.breakEvenCustomers}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[#79675E] block">Est. Cost Recovery:</span>
                    <strong className="text-base text-[#356B4B] font-display">
                      {comparison.base.costRecoveryPeriodMonths > 0 && comparison.base.costRecoveryPeriodMonths < 100
                        ? `${comparison.base.costRecoveryPeriodMonths} months`
                        : 'Immediate / Unfunded'}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[#79675E] block">Monthly Cash Flow:</span>
                    <strong className={`text-base font-display ${comparison.base.monthlyCashFlow >= 0 ? 'text-[#356B4B]' : 'text-[#9E3529]'}`}>
                      {formatCurrency(comparison.base.monthlyCashFlow)}
                    </strong>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#F6E9D8] border border-[#E5D8CB] flex items-start gap-3 text-xs text-[#79675E]">
                  <Sparkles className="w-4 h-4 text-[#C74634] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#49362E] block mb-0.5">Feasibility Evaluation:</strong>
                    {comparison.base.feasibilityNotice}
                  </div>
                </div>
              </div>

              {/* Legal & Educational Disclaimer */}
              <div className="p-4 rounded-2xl bg-[#FFF9F1] border border-[#E5D8CB] text-xs text-[#79675E] flex items-start gap-3">
                <ShieldAlert className="w-4 h-4 text-[#C74634] shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  {comparison.disclaimer}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
