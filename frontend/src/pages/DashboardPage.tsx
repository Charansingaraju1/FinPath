import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  FinancialOverview,
  FinancialGoal,
  DailyAction,
  Opportunity
} from '../types';
import { formatCurrency, formatCompactCurrency } from '../utils/formatters';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid
} from 'recharts';
import {
  ArrowRight,
  CheckCircle2,
  Check,
  Plus,
  Compass,
  Calendar,
  Sparkles,
  Target,
  PieChart as PieChartIcon,
  BarChart3,
  Receipt
} from 'lucide-react';

interface ExpenseTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: {
      name?: string;
      category?: string;
      value?: number;
      amount?: number;
      color?: string;
    };
  }>;
  totalExpenses: number;
}

const CustomExpenseTooltip: React.FC<ExpenseTooltipProps> = ({ active, payload, totalExpenses }) => {
  if (active && payload && payload.length) {
    const item = payload[0].payload;
    const name = item.name || item.category || 'Expense';
    const amount = Number(item.value ?? item.amount ?? 0);
    const percentage = totalExpenses > 0 ? ((amount / totalExpenses) * 100).toFixed(1) : '0.0';
    const color = item.color || '#C74634';

    return (
      <div className="bg-[#FFF9F1] px-3 py-2 rounded-xl border border-[#E5D8CB] shadow-md text-left z-50 pointer-events-none">
        <div className="flex items-center gap-1.5 mb-1">
          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
          <span className="text-xs font-bold text-[#49362E]">{name}</span>
        </div>
        <div className="text-sm font-bold font-display text-[#C74634]">
          {formatCurrency(amount)}
        </div>
        <div className="text-[10px] font-medium text-[#79675E] mt-0.5">
          {percentage}% of monthly expenses
        </div>
      </div>
    );
  }
  return null;
};

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState<FinancialOverview | null>(null);
  const [activeGoal, setActiveGoal] = useState<FinancialGoal | null>(null);
  const [dailyActions, setDailyActions] = useState<DailyAction[]>([]);
  const [savedOpportunities, setSavedOpportunities] = useState<Opportunity[]>([]);
  const [expenseChartType, setExpenseChartType] = useState<'donut' | 'bar'>('donut');

  useEffect(() => {
    let ignore = false;
    const loadDashboard = async () => {
      try {
        setLoading(true);
        const [ovData, goalData, actionsData, oppsData] = await Promise.allSettled([
          api.getFinancialOverview(),
          api.getActiveGoal(),
          api.getDailyActions(),
          api.getSavedOpportunities(),
        ]);

        if (!ignore) {
          if (ovData.status === 'fulfilled') setOverview(ovData.value);
          if (goalData.status === 'fulfilled') setActiveGoal(goalData.value);
          if (actionsData.status === 'fulfilled') setDailyActions(actionsData.value);
          if (oppsData.status === 'fulfilled') setSavedOpportunities(oppsData.value);
        }
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadDashboard();
    return () => {
      ignore = true;
    };
  }, []);

  const handleToggleTask = async (taskId: number) => {
    try {
      await api.toggleRoadmapTask(taskId);
      const updatedActions = await api.getDailyActions();
      setDailyActions(updatedActions);
    } catch (err) {
      console.error('Error toggling task:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-16 px-4 max-w-7xl mx-auto flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#C74634] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-[#79675E]">Loading your financial dashboard...</p>
        </div>
      </div>
    );
  }

  // Bar chart data for Income vs Expenses
  const cashFlowChartData = [
    {
      name: 'Cash Flow',
      Income: overview?.monthlyTakeHomeIncome || 0,
      Expenses: overview?.monthlyTotalExpenses || 0,
    },
  ];

  // Unified expense breakdown data calculations
  const essentialExpenses = overview?.monthlyEssentialExpenses || 0;
  const discretionaryExpenses = overview?.monthlyDiscretionaryExpenses || 0;
  const debtExpenses = overview?.monthlyDebtRepayments || 0;
  const totalExpenses = overview?.monthlyTotalExpenses || (essentialExpenses + discretionaryExpenses + debtExpenses);
  const hasExpenses = totalExpenses > 0;

  // Harmonious terracotta & warm cream palette colors
  const expenseColors = {
    essential: '#C74634',     // Primary terracotta
    discretionary: '#DE8A6D', // Warm coral terracotta
    debt: '#872719',          // Deep crimson terracotta
  };

  const categoryBreakdownData = [
    { name: 'Essential', category: 'Essential', value: essentialExpenses, amount: essentialExpenses, color: expenseColors.essential },
    { name: 'Discretionary', category: 'Discretionary', value: discretionaryExpenses, amount: discretionaryExpenses, color: expenseColors.discretionary },
    { name: 'Debt', category: 'Debt', value: debtExpenses, amount: debtExpenses, color: expenseColors.debt },
  ];

  // For donut chart: filter out zero-value segments to avoid 0-degree arc artifacts
  const donutChartData = categoryBreakdownData.filter((item) => item.value > 0);

  // For bar chart: include all categories so 0-value categories display accurately at zero
  const barChartData = categoryBreakdownData;

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-left space-y-10">
      {/* Header Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5D8CB]">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#49362E]">
            Welcome back, {user?.displayName || 'Friend'}
          </h1>
          <p className="text-sm sm:text-base text-[#79675E] mt-1">
            Your next step toward your financial goals starts here.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/transactions"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full font-semibold text-xs text-[#49362E] bg-[#FFF9F1] border border-[#E5D8CB] hover:bg-[#F4E2D9] shadow-2xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-[#C74634]" />
            Record Transaction
          </Link>
          <Link
            to="/opportunities"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full font-semibold text-xs text-white bg-[#C74634] hover:bg-[#9E3529] shadow-xs transition-colors"
          >
            <Compass className="w-3.5 h-3.5" />
            Find Opportunities
          </Link>
        </div>
      </div>

      {/* 6 Summary Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* 1: Monthly Income */}
        <div className="bg-[#FFF9F1] p-4 rounded-2xl border border-[#E5D8CB] shadow-soft">
          <span className="text-[11px] font-bold text-[#79675E] uppercase tracking-wider">Take-Home</span>
          <div className="text-xl font-bold font-display text-[#49362E] mt-1">
            {formatCurrency(overview?.monthlyTakeHomeIncome)}
          </div>
          <span className="text-[10px] text-[#79675E]">Monthly net income</span>
        </div>

        {/* 2: Monthly Expenses */}
        <div className="bg-[#FFF9F1] p-4 rounded-2xl border border-[#E5D8CB] shadow-soft">
          <span className="text-[11px] font-bold text-[#79675E] uppercase tracking-wider">Expenses</span>
          <div className="text-xl font-bold font-display text-[#49362E] mt-1">
            {formatCurrency(overview?.monthlyTotalExpenses)}
          </div>
          <span className="text-[10px] text-[#79675E]">Total monthly costs</span>
        </div>

        {/* 3: Surplus / Deficit */}
        <div className="bg-[#FFF9F1] p-4 rounded-2xl border border-[#E5D8CB] shadow-soft">
          <span className="text-[11px] font-bold text-[#79675E] uppercase tracking-wider">Monthly Surplus</span>
          <div className={`text-xl font-bold font-display mt-1 ${
            (overview?.monthlySurplus || 0) >= 0 ? 'text-[#356B4B]' : 'text-[#9E3529]'
          }`}>
            {(overview?.monthlySurplus || 0) >= 0 ? '+' : ''}{formatCurrency(overview?.monthlySurplus)}
          </div>
          <span className="text-[10px] text-[#79675E]">
            {(overview?.monthlySurplus || 0) >= 0 ? 'Safe monthly buffer' : 'Cash deficit'}
          </span>
        </div>

        {/* 4: Current Savings */}
        <div className="bg-[#FFF9F1] p-4 rounded-2xl border border-[#E5D8CB] shadow-soft">
          <span className="text-[11px] font-bold text-[#79675E] uppercase tracking-wider">Savings Reserve</span>
          <div className="text-xl font-bold font-display text-[#49362E] mt-1">
            {formatCurrency(overview?.currentSavings)}
          </div>
          <span className="text-[10px] text-[#79675E]">Liquid bank balance</span>
        </div>

        {/* 5: Active Goal Target */}
        <div className="bg-[#FFF9F1] p-4 rounded-2xl border border-[#E5D8CB] shadow-soft">
          <span className="text-[11px] font-bold text-[#79675E] uppercase tracking-wider">Active Target</span>
          <div className="text-xl font-bold font-display text-[#C74634] mt-1">
            {formatCurrency(activeGoal?.targetAmount)}
          </div>
          <span className="text-[10px] text-[#79675E] truncate block">
            {activeGoal?.title || 'No active goal'}
          </span>
        </div>

        {/* 6: Remaining Gap */}
        <div className="bg-[#FFF9F1] p-4 rounded-2xl border border-[#E5D8CB] shadow-soft">
          <span className="text-[11px] font-bold text-[#79675E] uppercase tracking-wider">Remaining Gap</span>
          <div className="text-xl font-bold font-display text-[#49362E] mt-1">
            {formatCurrency(activeGoal?.remainingGap)}
          </div>
          <span className="text-[10px] text-[#79675E]">
            {activeGoal?.monthsRemaining ? `${activeGoal.monthsRemaining} mo remaining` : 'On track'}
          </span>
        </div>
      </div>

      {/* Main Grid: Primary Goal Card + Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Primary Goal Card & Feasibility */}
        <div className="lg:col-span-7 space-y-6">
          {activeGoal ? (
            <div className="bg-[#FFF9F1] rounded-3xl p-6 sm:p-8 border border-[#E5D8CB] shadow-soft relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#E5D8CB]">
                <div>
                  <span className="text-xs font-bold text-[#C74634] uppercase tracking-wider">
                    Primary Financial Goal
                  </span>
                  <h2 className="font-display text-2xl font-bold text-[#49362E] mt-0.5">{activeGoal.title}</h2>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#DCE8DE] text-[#356B4B]">
                    {activeGoal.progressPercentage || 0}% Complete
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="my-5">
                <div className="flex justify-between text-xs text-[#79675E] mb-1.5">
                  <span>Allocated: {formatCurrency(activeGoal.currentAllocated)}</span>
                  <span>Target: {formatCurrency(activeGoal.targetAmount)}</span>
                </div>
                <div className="w-full bg-[#E5D8CB] h-3 rounded-full overflow-hidden">
                  <div
                    className="bg-[#C74634] h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, activeGoal.progressPercentage || 0)}%` }}
                  />
                </div>
              </div>

              {/* Required Monthly Contribution & Feasibility Insight */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4 p-4 rounded-2xl bg-[#F6E9D8] border border-[#E5D8CB]">
                <div>
                  <span className="text-xs text-[#79675E]">Required Monthly Contribution:</span>
                  <div className="text-xl font-bold text-[#C74634] mt-0.5">
                    {formatCurrency(activeGoal.requiredMonthlyContribution)} <span className="text-xs font-normal text-[#79675E]">/ month</span>
                  </div>
                </div>
                <div>
                  <span className="text-xs text-[#79675E]">Timeline Deadline:</span>
                  <div className="text-sm font-bold text-[#49362E] mt-1 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-[#79675E]" />
                    {activeGoal.deadline} ({activeGoal.monthsRemaining} months left)
                  </div>
                </div>
              </div>

              {/* Actionable Assessment Advice */}
              {overview?.activeGoalAssessment && (
                <div className="mt-4 p-4 rounded-xl bg-white border border-[#E5D8CB] text-xs text-[#79675E] space-y-2">
                  <div className="font-bold text-[#49362E] flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#C74634]" />
                    <span>Feasibility Assessment: {overview.activeGoalAssessment.statusLabel}</span>
                  </div>
                  <p className="leading-relaxed">{overview.activeGoalAssessment.explanation}</p>
                </div>
              )}

              <div className="mt-6 flex items-center justify-between pt-4 border-t border-[#E5D8CB]">
                <Link
                  to="/roadmap"
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-[#C74634] hover:text-[#9E3529]"
                >
                  View Full Execution Roadmap <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/calculator"
                  className="text-xs font-semibold text-[#79675E] hover:text-[#49362E]"
                >
                  Model Revenue Scenarios
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-[#FFF9F1] rounded-3xl p-8 border border-[#E5D8CB] shadow-soft text-center space-y-4">
              <Target className="w-12 h-12 text-[#C74634] mx-auto opacity-70" />
              <h2 className="font-display text-2xl font-bold text-[#49362E]">Set Your First Financial Goal</h2>
              <p className="text-sm text-[#79675E] max-w-md mx-auto">
                Define an emergency fund, launch budget, or savings target to generate a step-by-step roadmap.
              </p>
              <Link
                to="/onboarding"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold text-white bg-[#C74634] hover:bg-[#9E3529] text-sm"
              >
                Create Target Goal <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}

          {/* Income vs Expenses Chart */}
          <div className="bg-[#FFF9F1] rounded-3xl p-6 border border-[#E5D8CB] shadow-soft">
            <h3 className="font-display text-xl font-bold text-[#49362E] mb-4">Cash Flow Overview</h3>
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cashFlowChartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#79675E" fontSize={12} />
                  <YAxis stroke="#79675E" fontSize={12} tickFormatter={(val) => formatCompactCurrency(Number(val))} />
                  <Tooltip
                    formatter={(val) => [formatCurrency(Number(val)), '']}
                    contentStyle={{ backgroundColor: '#FFF9F1', borderRadius: '12px', borderColor: '#E5D8CB' }}
                  />
                  <Bar dataKey="Income" fill="#356B4B" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="Expenses" fill="#C74634" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Column: "What Should I Do Today?" & Saved Opportunities */}
        <div className="lg:col-span-5 space-y-6">
          {/* Today's Action Items */}
          <div className="bg-[#FFF9F1] rounded-3xl p-6 border border-[#E5D8CB] shadow-soft">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5D8CB] mb-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#C74634]" />
                <h3 className="font-display text-xl font-bold text-[#49362E]">What Should I Do Today?</h3>
              </div>
              <Link to="/roadmap" className="text-xs font-bold text-[#C74634] hover:underline">
                Roadmap
              </Link>
            </div>

            {dailyActions.length > 0 ? (
              <div className="space-y-3">
                {dailyActions.map((action) => (
                  <div
                    key={action.taskId}
                    className="p-3.5 rounded-xl bg-white border border-[#E5D8CB] hover:border-[#C74634]/50 transition-colors flex items-start gap-3"
                  >
                    <button
                      onClick={() => handleToggleTask(action.taskId)}
                      className="mt-0.5 w-5 h-5 rounded-md border-2 border-[#E5D8CB] hover:border-[#C74634] flex items-center justify-center transition-colors"
                      aria-label="Mark task complete"
                    >
                      <Check className="w-3.5 h-3.5 text-transparent hover:text-[#C74634]" />
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-[#49362E] truncate">{action.title}</div>
                      <div className="flex items-center gap-2 text-[10px] text-[#79675E] mt-1">
                        <span className="bg-[#F4E2D9] px-1.5 py-0.5 rounded text-[#9E3529] font-medium">
                          {action.stage}
                        </span>
                        <span>{action.reason}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-xs text-[#79675E]">
                All daily priorities completed! Check your full roadmap for upcoming milestones.
              </div>
            )}
          </div>

          {/* Monthly Expense Split Interactive Card */}
          <div className="bg-[#FFF9F1] rounded-3xl p-6 border border-[#E5D8CB] shadow-soft">
            {/* Header with Title and Segmented Chart Selector */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E5D8CB] mb-4">
              <div>
                <h3 className="font-display text-lg font-bold text-[#49362E]">Monthly Expense Split</h3>
                <p className="text-[11px] text-[#79675E]">Essential vs discretionary vs debt allocation</p>
              </div>

              {/* Segmented Control Toggle */}
              <div
                role="tablist"
                aria-label="Expense chart type"
                className="inline-flex self-start sm:self-auto p-1 bg-[#F4E2D9] rounded-xl border border-[#E5D8CB]"
              >
                <button
                  type="button"
                  role="tab"
                  id="tab-donut-chart"
                  aria-selected={expenseChartType === 'donut'}
                  aria-controls="expense-chart-view"
                  onClick={() => setExpenseChartType('donut')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C74634] ${
                    expenseChartType === 'donut'
                      ? 'bg-[#C74634] text-white shadow-xs'
                      : 'text-[#79675E] hover:text-[#49362E] hover:bg-[#FBF5EC]/60'
                  }`}
                >
                  <PieChartIcon className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Donut</span>
                </button>
                <button
                  type="button"
                  role="tab"
                  id="tab-bar-chart"
                  aria-selected={expenseChartType === 'bar'}
                  aria-controls="expense-chart-view"
                  onClick={() => setExpenseChartType('bar')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C74634] ${
                    expenseChartType === 'bar'
                      ? 'bg-[#C74634] text-white shadow-xs'
                      : 'text-[#79675E] hover:text-[#49362E] hover:bg-[#FBF5EC]/60'
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Bar</span>
                </button>
              </div>
            </div>

            {/* Chart Body or Empty State */}
            <div id="expense-chart-view" role="tabpanel" aria-labelledby={expenseChartType === 'donut' ? 'tab-donut-chart' : 'tab-bar-chart'}>
              {!hasExpenses ? (
                <div className="h-52 w-full flex flex-col items-center justify-center p-6 text-center bg-[#FAF3EA]/70 rounded-2xl border border-dashed border-[#E5D8CB]">
                  <div className="w-10 h-10 rounded-full bg-[#F4E2D9] flex items-center justify-center text-[#C74634] mb-2">
                    <Receipt className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-bold text-[#49362E]">No Expense Data Recorded</p>
                  <p className="text-[11px] text-[#79675E] max-w-xs mt-1">
                    Record your expenses or update your budget to see your monthly category breakdown.
                  </p>
                  <Link
                    to="/transactions"
                    className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#C74634] hover:bg-[#9E3529] transition-colors"
                  >
                    Record Expense
                  </Link>
                </div>
              ) : expenseChartType === 'donut' ? (
                <div className="relative h-52 w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={donutChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={72}
                        paddingAngle={donutChartData.length > 1 ? 4 : 0}
                        dataKey="value"
                      >
                        {donutChartData.map((entry, index) => (
                          <Cell key={`donut-cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomExpenseTooltip totalExpenses={totalExpenses} />} />
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Total in center of donut */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-[10px] font-bold text-[#79675E] uppercase tracking-wider">Total</span>
                    <span className="text-sm sm:text-base font-bold text-[#49362E] font-display">
                      {formatCurrency(totalExpenses)}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="h-52 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={barChartData}
                      margin={{ top: 18, right: 10, left: -10, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5D8CB" opacity={0.6} />
                      <XAxis
                        dataKey="category"
                        tick={{ fill: '#49362E', fontSize: 11, fontWeight: 600 }}
                        tickLine={false}
                        axisLine={{ stroke: '#E5D8CB' }}
                        interval={0}
                      />
                      <YAxis
                        tickFormatter={(val) => formatCompactCurrency(Number(val))}
                        tick={{ fill: '#79675E', fontSize: 10 }}
                        tickLine={false}
                        axisLine={false}
                        domain={[0, 'auto']}
                        width={45}
                      />
                      <Tooltip
                        content={<CustomExpenseTooltip totalExpenses={totalExpenses} />}
                        cursor={{ fill: 'rgba(231, 191, 169, 0.15)', radius: 8 }}
                      />
                      <Bar
                        dataKey="amount"
                        radius={[6, 6, 0, 0]}
                        maxBarSize={44}
                        label={{
                          position: 'top',
                          formatter: (val: any) => (Number(val) > 0 ? formatCompactCurrency(Number(val)) : ''),
                          fill: '#79675E',
                          fontSize: 10,
                          fontWeight: 600,
                        }}
                      >
                        {barChartData.map((entry, index) => (
                          <Cell key={`bar-cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Complete Category Legend */}
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#E5D8CB]/60 text-center mt-2">
                {categoryBreakdownData.map((cat) => (
                  <div
                    key={cat.name}
                    className="flex flex-col items-center p-1.5 rounded-xl hover:bg-[#FAF3EA]/80 transition-colors"
                  >
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-[#49362E]">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                      {cat.name}
                    </span>
                    <span className="text-xs font-bold text-[#49362E] font-display mt-0.5">
                      {formatCurrency(cat.value)}
                    </span>
                    <span className="text-[10px] text-[#79675E]">
                      {totalExpenses > 0 ? `${((cat.value / totalExpenses) * 100).toFixed(1)}%` : '0.0%'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Saved Opportunities Quick Widget */}
          <div className="bg-[#FFF9F1] rounded-3xl p-6 border border-[#E5D8CB] shadow-soft">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5D8CB] mb-3">
              <h3 className="font-display text-lg font-bold text-[#49362E]">Saved Opportunities</h3>
              <Link to="/opportunities" className="text-xs font-bold text-[#C74634] hover:underline">
                View All
              </Link>
            </div>

            {savedOpportunities.length > 0 ? (
              <div className="space-y-2.5">
                {savedOpportunities.slice(0, 3).map((opp) => (
                  <Link
                    key={opp.id}
                    to={`/opportunities/${opp.id}`}
                    className="block p-3 rounded-xl bg-white border border-[#E5D8CB] hover:border-[#C74634]/60 transition-colors"
                  >
                    <div className="text-xs font-bold text-[#49362E] truncate">{opp.title}</div>
                    <div className="flex items-center justify-between text-[10px] text-[#79675E] mt-1">
                      <span>{opp.targetCustomer}</span>
                      <span className="font-semibold text-[#356B4B]">Fit: {opp.userCalculatedFitScore || opp.baseFitScore}</span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-xs text-[#79675E]">
                No saved opportunities yet. Explore the catalog to bookmark problems worth solving.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
