import React from 'react';
import { Link } from 'react-router-dom';
import {
  Target,
  Receipt,
  TrendingUp,
  Compass,
  CheckCircle2,
  Calculator,
  Map,
  LineChart,
  LayoutDashboard,
  Bot,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

interface ServiceItem {
  id: string;
  number: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  tag: string;
  whatItDoes: string;
  howToAccess: {
    label: string;
    route: string;
    requiresAuth: boolean;
  };
  whatYouProvide: string[];
  whatYouReceive: string[];
  limitations: string;
}

const SERVICES: ServiceItem[] = [
  {
    id: 'goal-planning',
    number: '01',
    title: 'Financial Goal Planning',
    icon: Target,
    tag: 'Capital & Reserve Targets',
    whatItDoes:
      'Allows you to set dedicated financial targets (emergency fund, business startup reserve, tool purchases, debt paydown) with explicit deadline dates and automated contribution calculation.',
    howToAccess: {
      label: 'Open Dashboard & Goals',
      route: '/dashboard',
      requiresAuth: true,
    },
    whatYouProvide: [
      'Goal Title and Goal Category',
      'Target Amount in Indian Rupees (₹)',
      'Initial Allocated Savings',
      'Target Completion Deadline Date',
    ],
    whatYouReceive: [
      'Exact Required Monthly Contribution Breakdown',
      'Months Remaining until Deadline',
      'Real-time Progress Bar & Remaining Gap (₹)',
      'Achievability Status (Achievable, Potentially Achievable, Unlikely)',
    ],
    limitations:
      'Assumes a constant monthly savings rate and does not account for variable inflation, unexpected medical events, or bank interest rates.',
  },
  {
    id: 'income-expense-tracking',
    number: '02',
    title: 'Income and Expense Tracking',
    icon: Receipt,
    tag: 'Accurate Cash Accounting',
    whatItDoes:
      'Provides transaction recording that cleanly separates your personal living costs from actual business income, operating expenses, and goal allocations.',
    howToAccess: {
      label: 'Go to Finances & Transactions',
      route: '/transactions',
      requiresAuth: true,
    },
    whatYouProvide: [
      'Transaction Type (Personal Income/Expense, Business Revenue/Costs, Goal Allocation)',
      'Category tag (Groceries, Rent, Software, Client Retainer, etc.)',
      'Amount in Indian Rupees (₹) and Transaction Date',
      'Optional descriptive notes and target Goal linkage',
    ],
    whatYouReceive: [
      'Separate Personal Net Cash vs Business Net Profit calculations',
      'Filterable transaction ledger with inline edit and delete controls',
      'Exportable CSV spreadsheet of your complete financial history',
    ],
    limitations:
      'Transactions must be entered manually; FinPath does not automatically sync with bank accounts or credit cards.',
  },
  {
    id: 'financial-gap-analysis',
    number: '03',
    title: 'Financial Gap Analysis',
    icon: TrendingUp,
    tag: 'Deterministic Math',
    whatItDoes:
      'Calculates your true disposable monthly surplus and contrasts it against your goal requirements to reveal shortfalls and cost recovery timelines.',
    howToAccess: {
      label: 'View Baseline in Settings',
      route: '/settings',
      requiresAuth: true,
    },
    whatYouProvide: [
      'Monthly Take-Home Income',
      'Essential Living Expenses (Rent, Food, Utilities)',
      'Discretionary Spending (Entertainment, Dining)',
      'Monthly Debt Repayments (Loans, Credit)',
    ],
    whatYouReceive: [
      'True Monthly Surplus: Income - Essential - Discretionary - Debt',
      'Early deficit flags if monthly spending exceeds total take-home pay',
      'Visual surplus allocation towards active goals',
    ],
    limitations:
      'Requires accurate self-reported baseline figures; underestimates if irregular or seasonal expenses are omitted.',
  },
  {
    id: 'opportunity-discovery',
    number: '04',
    title: 'Real-World Opportunity Discovery',
    icon: Compass,
    tag: 'Curated Catalog',
    whatItDoes:
      'Presents a structured catalog of verified, practical business and service problems worth solving across Digital Services, Operations, Commerce, and SaaS.',
    howToAccess: {
      label: 'Explore Opportunities',
      route: '/opportunities',
      requiresAuth: false,
    },
    whatYouProvide: [
      'Search keywords, domain category filter, difficulty preference (Easy, Medium, Hard), or validation stage filter',
    ],
    whatYouReceive: [
      'Target customer definitions, problem descriptions, and required skill tags',
      'Estimated startup capital ranges calibrated in INR (e.g. ₹2,000 - ₹20,000)',
      '0–100 Personalized Fit Scores matching your budget and weekly availability',
      'Side-by-side comparison matrix for up to 3 opportunities',
    ],
    limitations:
      'Catalog opportunities are educational prompts representing typical market needs, not guaranteed employment contracts or turn-key businesses.',
  },
  {
    id: 'opportunity-validation',
    number: '05',
    title: 'Opportunity Fit & Customer Validation',
    icon: CheckCircle2,
    tag: 'Evidence Before Expenditure',
    whatItDoes:
      'Provides a dedicated Validation Workspace for each opportunity to record prospective customer interviews, qualitative feedback, and actual willingness to pay.',
    howToAccess: {
      label: 'View Opportunity Workspace',
      route: '/opportunities',
      requiresAuth: true,
    },
    whatYouProvide: [
      'Interviewee profile, interview date, documented recurring pain points',
      'Current workaround tools used by the customer',
      'Verified Willingness-to-Pay amount (₹)',
      'Validation Stage (Researching, Interviewing, Problem Confirmed, WTP Tested, Ready to Build)',
    ],
    whatYouReceive: [
      'Centralized interview repository linked to each specific opportunity',
      'Validation stage status tracker preventing premature capital investment',
      'Readiness indicator based on verified customer signals',
    ],
    limitations:
      'Customer verbal commitments in interviews do not equal signed purchase orders. Real demand is only proven when money changes hands.',
  },
  {
    id: 'revenue-calculator',
    number: '06',
    title: 'Revenue and Cost Scenario Calculator',
    icon: Calculator,
    tag: 'Unit Economics Modeling',
    whatItDoes:
      'Models business feasibility and unit economics by simulating price points, variable delivery costs, fixed monthly overhead, and customer acquisition costs.',
    howToAccess: {
      label: 'Launch Calculator',
      route: '/calculator',
      requiresAuth: false,
    },
    whatYouProvide: [
      'Price Per Customer / Deliverable (₹)',
      'Expected Monthly Customer Volume',
      'Variable Cost Per Deliverable (₹)',
      'Monthly Fixed Overhead (Software, Phone, Internet) (₹)',
      'Customer Acquisition Cost (CAC) and Lead Conversion Rate (%)',
      'Initial Startup & Equipment Costs (₹)',
    ],
    whatYouReceive: [
      'Conservative, Base, and Optimistic scenario comparison matrix',
      'Estimated Monthly Operating Profit & Monthly Cash Flow',
      'Exact Break-Even Customer Count required each month',
      'Initial Funding Required and Cost Recovery Period in Months',
      'Actionable feasibility guidance notices',
    ],
    limitations:
      'Calculations assume static conversion rates and prompt payment. They do not factor in bad debt, seasonality, or commercial taxes.',
  },
  {
    id: 'roadmap-planning',
    number: '07',
    title: 'Step-by-Step Roadmap Planning',
    icon: Map,
    tag: 'Paced Execution',
    whatItDoes:
      'Generates a tailored 3-, 6-, or 12-month phase-by-phase execution plan designed to fit around your current weekly study or work schedule.',
    howToAccess: {
      label: 'Open Active Roadmap',
      route: '/roadmap',
      requiresAuth: true,
    },
    whatYouProvide: [
      'Target timeline (3, 6, or 12 Months)',
      'Available weekly hours (e.g. 5, 10, or 20 hrs/week)',
      'Active opportunity selection',
    ],
    whatYouReceive: [
      '5 Sequential Phases: 1. Validate Demand -> 2. Build MVP -> 3. Pilot Clients -> 4. Improve Offer -> 5. Scale Sustainably',
      'Actionable task cards with estimated hours and stage classifications',
      'Daily Priority Suggestion highlighting what to work on today',
      'Ability to add custom tasks and check off completed items',
    ],
    limitations:
      'Roadmap milestones are suggested guidelines; execution speed depends entirely on individual dedication and customer responsiveness.',
  },
  {
    id: 'progress-tracking',
    number: '08',
    title: 'Progress Tracking & Milestones',
    icon: LineChart,
    tag: 'Execution Velocity',
    whatItDoes:
      'Aggregates your savings pace, completed roadmap tasks, customer interviews, and actual business net profit into a unified execution report.',
    howToAccess: {
      label: 'Inspect Progress Report',
      route: '/progress',
      requiresAuth: true,
    },
    whatYouProvide: [
      'Ongoing task completions on the roadmap and financial transaction logs',
    ],
    whatYouReceive: [
      'Pacing Status Indicator (Ahead, On Track, Slightly Behind, Off Track)',
      'Savings Variance: Planned Savings vs Actual Allocated Savings (₹)',
      'Roadmap completion rate percentage and customer discovery tally',
      'Dynamic strategic recommendations tailored to your current bottleneck',
    ],
    limitations:
      'Progress analytics reflect data you input into FinPath and cannot verify whether external business deliverables were accepted by clients.',
  },
  {
    id: 'financial-dashboard',
    number: '09',
    title: 'Financial Dashboard and Reports',
    icon: LayoutDashboard,
    tag: 'Unified Command Center',
    whatItDoes:
      'Offers a single-pane overview of your income, essential expenses, monthly surplus, current savings, and primary active financial goal progress.',
    howToAccess: {
      label: 'Open Dashboard',
      route: '/dashboard',
      requiresAuth: true,
    },
    whatYouProvide: [
      'Setup baseline numbers during onboarding or through Settings',
    ],
    whatYouReceive: [
      'Real-time cash flow overview cards with clean INR formatting',
      'Visual breakdown chart comparing income, expenses, and savings allocated',
      'Quick action shortcuts to log transactions or create roadmaps',
      'Next priority milestones from your active roadmap',
    ],
    limitations:
      'The dashboard displays self-reported figures and does not provide certified accounting or tax audit documentation.',
  },
  {
    id: 'ai-guidance',
    number: '10',
    title: 'Educational AI Assistant',
    icon: Bot,
    tag: 'Interactive Guidance',
    whatItDoes:
      'Provides a floating conversational assistant available across all pages to explain FinPath features, break-even math, roadmap phases, and responsible planning.',
    howToAccess: {
      label: 'Click "Ask FinPath AI" at bottom-right of screen',
      route: '#chat',
      requiresAuth: false,
    },
    whatYouProvide: [
      'Questions regarding goal calculations, opportunity selection, calculator formulas, or data safety',
    ],
    whatYouReceive: [
      'Instant educational explanations structured with formulas and practical steps',
      'Clickable suggested starter questions',
      'Clear transparency notices indicating whether running on the local rule engine or an external provider',
    ],
    limitations:
      'The assistant is strictly an educational tool. It does not provide certified financial, tax, or legal advice, and it cannot view or share your private financial account records.',
  },
];

export const ServicesPage: React.FC = () => {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-left space-y-12">
      {/* Header */}
      <div className="pb-8 border-b border-[#E5D8CB] space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F4E2D9] text-xs font-semibold text-[#9E3529]">
          <Target className="w-3.5 h-3.5" />
          PLATFORM CAPABILITIES
        </div>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#49362E]">
          FinPath Services & Features
        </h1>
        <p className="text-sm sm:text-base text-[#79675E] max-w-3xl leading-relaxed">
          Every tool in FinPath is built around deterministic math, evidence-based customer validation, and practical milestone roadmaps. Explore what each service does, how to access it, and its exact operating assumptions.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {SERVICES.map((s) => {
          const IconComp = s.icon;
          return (
            <div
              key={s.id}
              id={s.id}
              className="bg-[#FFF9F1] rounded-3xl p-7 border border-[#E5D8CB] shadow-soft flex flex-col justify-between hover:border-[#C74634]/60 transition-all space-y-6"
            >
              <div className="space-y-5">
                {/* Top badge & number */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-[#F4E2D9] border border-[#E5D8CB] flex items-center justify-center text-[#C74634]">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-[#9E3529] uppercase tracking-wider bg-[#F6E9D8] px-2 py-0.5 rounded-full">
                        {s.tag}
                      </span>
                    </div>
                  </div>
                  <span className="font-display text-2xl font-bold text-[#E5D8CB]">
                    {s.number}
                  </span>
                </div>

                {/* Title & Description */}
                <div>
                  <h2 className="font-display text-2xl font-bold text-[#49362E]">
                    {s.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-[#79675E] mt-2 leading-relaxed">
                    {s.whatItDoes}
                  </p>
                </div>

                {/* Inputs & Outputs Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="bg-[#F6E9D8] p-3.5 rounded-2xl border border-[#E5D8CB] space-y-1.5">
                    <h3 className="text-xs font-bold text-[#49362E] uppercase tracking-wider">
                      What You Provide:
                    </h3>
                    <ul className="list-disc pl-4 space-y-1 text-xs text-[#79675E] leading-relaxed">
                      {s.whatYouProvide.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-[#F6E9D8] p-3.5 rounded-2xl border border-[#E5D8CB] space-y-1.5">
                    <h3 className="text-xs font-bold text-[#356B4B] uppercase tracking-wider">
                      What You Receive:
                    </h3>
                    <ul className="list-disc pl-4 space-y-1 text-xs text-[#79675E] leading-relaxed">
                      {s.whatYouReceive.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Limitations */}
                <div className="p-3 rounded-xl bg-white border border-[#E5D8CB] text-xs text-[#79675E] leading-relaxed flex items-start gap-2">
                  <ShieldAlert className="w-4 h-4 text-[#C74634] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#49362E]">Important Limitations:</strong> {s.limitations}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2 border-t border-[#E5D8CB]/60 flex items-center justify-between">
                <span className="text-[11px] text-[#79675E]">
                  {s.howToAccess.requiresAuth ? 'Requires free account' : 'Available publicly'}
                </span>
                {s.howToAccess.route.startsWith('#') ? (
                  <span className="text-xs font-semibold text-[#C74634] inline-flex items-center gap-1">
                    {s.howToAccess.label}
                  </span>
                ) : (
                  <Link
                    to={s.howToAccess.route}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C74634] hover:text-[#9E3529] transition-colors"
                  >
                    <span>{s.howToAccess.label}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Trust Notice */}
      <div className="bg-[#FFF9F1] p-6 sm:p-8 rounded-3xl border border-[#E5D8CB] text-center space-y-3">
        <h3 className="font-display text-xl font-bold text-[#49362E]">
          Built on Verification, Not Speculation
        </h3>
        <p className="text-xs sm:text-sm text-[#79675E] max-w-2xl mx-auto leading-relaxed">
          FinPath is designed to prevent financial loss by teaching you to validate customer willingness to pay before writing code or spending capital. Projections are deterministic educational models, not income guarantees.
        </p>
        <div className="pt-2 flex justify-center gap-4">
          <Link
            to="/opportunities"
            className="px-6 py-2.5 rounded-full font-semibold text-xs text-white bg-[#C74634] hover:bg-[#9E3529] transition-colors"
          >
            Browse Problem Catalog
          </Link>
          <Link
            to="/calculator"
            className="px-6 py-2.5 rounded-full font-semibold text-xs text-[#49362E] bg-[#F6E9D8] hover:bg-[#F4E2D9] border border-[#E5D8CB] transition-colors"
          >
            Test Unit Economics
          </Link>
        </div>
      </div>
    </div>
  );
};
