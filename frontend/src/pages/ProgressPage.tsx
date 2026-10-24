import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { ProgressReport } from '../types';
import {
  LineChart as LineChartIcon,
  Lightbulb,
  Sparkles
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { formatCurrency, formatCompactCurrency } from '../utils/formatters';

export const ProgressPage: React.FC = () => {
  const [report, setReport] = useState<ProgressReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        const data = await api.getProgressReport();
        setReport(data);
      } catch (err) {
        console.error('Error fetching progress report:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, []);

  if (loading || !report) {
    return (
      <div className="min-h-screen py-20 px-4 max-w-7xl mx-auto flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-3 border-[#C74634] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-[#79675E]">Compiling progress reports...</p>
        </div>
      </div>
    );
  }

  const savingsComparisonData = [
    {
      name: 'Planned Target',
      Amount: report.plannedSavings || 0,
    },
    {
      name: 'Actual Saved',
      Amount: report.actualSavings || 0,
    },
  ];

  const pacingColorMap = {
    AHEAD: 'bg-[#DCE8DE] text-[#356B4B] border-[#356B4B]/30',
    ON_TRACK: 'bg-[#DCE8DE] text-[#356B4B] border-[#356B4B]/30',
    SLIGHTLY_BEHIND: 'bg-[#F6E9D8] text-[#9E3529] border-[#E5D8CB]',
    OFF_TRACK: 'bg-[#F4E2D9] text-[#9E3529] border-[#C74634]/30',
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-left space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5D8CB]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F4E2D9] text-xs font-semibold text-[#9E3529] mb-2">
            <LineChartIcon className="w-3.5 h-3.5" />
            OUTCOMES & PACING REPORT
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#49362E]">
            Progress & Milestone Health
          </h1>
          <p className="text-sm text-[#79675E] mt-1">
            Track planned vs actual savings, customer validation pacing, and actionable course corrections.
          </p>
        </div>

        <div className={`px-4 py-2 rounded-2xl border text-xs font-bold flex items-center gap-2 ${pacingColorMap[report.pacingStatus] || ''}`}>
          <Sparkles className="w-4 h-4" />
          <span>Status: {report.pacingStatus.replace(/_/g, ' ')}</span>
        </div>
      </div>

      {/* Metric Highlights Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Goal Completion */}
        <div className="bg-[#FFF9F1] p-5 rounded-2xl border border-[#E5D8CB] shadow-soft">
          <span className="text-[11px] font-bold text-[#79675E] uppercase tracking-wider">
            Goal Completion
          </span>
          <div className="text-3xl font-display font-bold text-[#C74634] mt-1">
            {report.goalCompletionPercentage}%
          </div>
          <span className="text-[10px] text-[#79675E]">
            {formatCurrency(report.currentGoalAllocated)} / {formatCurrency(report.targetGoalAmount)}
          </span>
        </div>

        {/* Task Completion */}
        <div className="bg-[#FFF9F1] p-5 rounded-2xl border border-[#E5D8CB] shadow-soft">
          <span className="text-[11px] font-bold text-[#79675E] uppercase tracking-wider">
            Roadmap Execution
          </span>
          <div className="text-3xl font-display font-bold text-[#356B4B] mt-1">
            {report.taskCompletionPercentage}%
          </div>
          <span className="text-[10px] text-[#79675E]">
            {report.completedRoadmapTasks} of {report.totalRoadmapTasks} tasks complete
          </span>
        </div>

        {/* Customer Interviews */}
        <div className="bg-[#FFF9F1] p-5 rounded-2xl border border-[#E5D8CB] shadow-soft">
          <span className="text-[11px] font-bold text-[#79675E] uppercase tracking-wider">
            Discovery Calls
          </span>
          <div className="text-3xl font-display font-bold text-[#49362E] mt-1">
            {report.customerInterviewsCompleted}
          </div>
          <span className="text-[10px] text-[#79675E]">
            {report.opportunitiesValidatedCount} opportunities validated
          </span>
        </div>

        {/* Paying Customers */}
        <div className="bg-[#FFF9F1] p-5 rounded-2xl border border-[#E5D8CB] shadow-soft">
          <span className="text-[11px] font-bold text-[#79675E] uppercase tracking-wider">
            Actual Customers
          </span>
          <div className="text-3xl font-display font-bold text-[#356B4B] mt-1">
            {report.actualPayingCustomersCount}
          </div>
          <span className="text-[10px] text-[#79675E]">
            Net: {formatCurrency(report.actualNetBusinessProfit)}
          </span>
        </div>
      </div>

      {/* Comparison Chart & Strategic Advice */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Planned vs Actual Savings */}
        <div className="lg:col-span-6 bg-[#FFF9F1] rounded-3xl p-6 border border-[#E5D8CB] shadow-soft space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E5D8CB]">
            <h2 className="font-display text-xl font-bold text-[#49362E]">Planned vs. Actual Savings</h2>
            <span className="text-xs text-[#79675E]">
              Variance: <strong className={report.savingsVariance >= 0 ? 'text-[#356B4B]' : 'text-[#9E3529]'}>
                {formatCurrency(report.savingsVariance)}
              </strong>
            </span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={savingsComparisonData} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#79675E" fontSize={12} />
                <YAxis stroke="#79675E" fontSize={12} tickFormatter={(v) => formatCompactCurrency(Number(v))} />
                <Tooltip
                  formatter={(val) => [formatCurrency(Number(val)), 'Amount']}
                  contentStyle={{ backgroundColor: '#FFF9F1', borderRadius: '12px', borderColor: '#E5D8CB' }}
                />
                <Bar dataKey="Amount" fill="#C74634" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Strategic Next Steps */}
        <div className="lg:col-span-6 bg-[#FFF9F1] rounded-3xl p-6 border border-[#E5D8CB] shadow-soft space-y-4">
          <h2 className="font-display text-xl font-bold text-[#49362E] flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-[#C74634]" />
            Constructive Recommendations
          </h2>

          <div className="space-y-3">
            {report.strategicRecommendations.map((rec, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-white border border-[#E5D8CB] flex items-start gap-3 text-xs text-[#49362E] leading-relaxed"
              >
                <span className="w-5 h-5 rounded-full bg-[#F4E2D9] text-[#9E3529] font-bold flex items-center justify-center shrink-0 text-[10px]">
                  {idx + 1}
                </span>
                <span>{rec}</span>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-[#F6E9D8] border border-[#E5D8CB] text-xs text-[#79675E]">
            <strong className="text-[#49362E] block mb-1">Pacing Insight:</strong>
            When milestones slip, do not abandon your plan. Extending your target timeline by 1 to 3 months lowers the monthly financial pressure while keeping your goal intact.
          </div>
        </div>
      </div>
    </div>
  );
};
