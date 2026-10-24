import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Modal } from '../components/common/Modal';
import {
  ArrowRight,
  Play,
  Target,
  Search,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  ShieldAlert,
  Clock,
  Compass,
  IndianRupee,
  ChevronRight,
  Sliders,
  Layers,
  ChevronDown
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const { loginAsDemoUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleStartDemo = async () => {
    setDemoModalOpen(false);
    await loginAsDemoUser();
    navigate('/dashboard');
  };

  const sampleOpportunities = [
    {
      id: 1,
      category: 'Digital Services',
      title: 'Local Small Businesses Without Effective Web Presence',
      target: 'Local clinics, dentists, family restaurants',
      description: 'Businesses lose footfall because their website is mobile-broken or nonexistent.',
      skills: 'HTML/CSS, React, Local SEO, Copywriting',
      cost: '₹4,000 - ₹20,000',
      status: 'Researching',
      score: 88,
    },
    {
      id: 2,
      category: 'Operations',
      title: 'Salon & Therapist Appointment No-Show Reduction',
      target: 'Independent barbers, salons, wellness clinics',
      description: 'Losing 15-20% revenue from last-minute client no-shows and manual SMS replies.',
      skills: 'No-code workflows, Twilio/Calendly, Client setup',
      cost: '₹8,000 - ₹25,000',
      status: 'Problem Confirmed',
      score: 84,
    },
    {
      id: 3,
      category: 'Education',
      title: 'STEM Student Tutoring & Practical Mentorship',
      target: 'High school students & freshmen undergraduates',
      description: 'Foundational algebra, physics, and coding support with personalized weekly recaps.',
      skills: 'Math/Code fundamentals, clear communication',
      cost: '₹1,500 - ₹8,000',
      status: 'Ready to Build',
      score: 91,
    },
  ];

  const faqs = [
    {
      q: 'Does FinPath guarantee I will make money?',
      a: 'No. FinPath is an educational financial planning and opportunity analysis platform. We provide deterministic cash flow math, structured customer validation frameworks, and feasibility calculators. Market success depends entirely on actual customer demand and your own execution.',
    },
    {
      q: 'Do I need a business idea before starting?',
      a: 'Not at all. FinPath starts with problem discovery. We help you explore recurring friction points that local businesses or students face, match them to your skills, and guide you through customer discovery calls before you spend any capital.',
    },
    {
      q: 'Do I need to connect my bank account?',
      a: 'Never. FinPath does not require your banking credentials, account numbers, or PINs. You enter your income and expense categories manually or record transactions as needed, keeping full control of your private information.',
    },
    {
      q: 'How does the roadmap adapt to my schedule?',
      a: 'When setting your profile, you specify your available hours per week (e.g., 5, 10, or 20 hours). FinPath sizes milestones and deadlines across 3-, 6-, or 12-month timelines so your goals fit comfortably around study or full-time employment.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F6E9D8] text-[#49362E]">
      {/* ============================================================ */}
      {/* HERO SECTION                                                 */}
      {/* ============================================================ */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32 border-b border-[#E5D8CB]">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#E7BFA9]/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-0 w-96 h-96 bg-[#DCE8DE]/40 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Headlines & CTA */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF9F1] border border-[#E5D8CB] text-xs font-semibold tracking-wider text-[#9E3529] uppercase shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-[#C74634]" />
                YOUR FINANCIAL JOURNEY
              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#49362E] leading-[1.12]">
                Small steps.{' '}
                <span className="block text-[#C74634] italic font-normal">Bigger possibilities.</span>
              </h1>

              <p className="text-lg sm:text-xl text-[#79675E] leading-relaxed max-w-xl">
                Plan your finances, discover real opportunities, and build a future that's on your terms.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to={isAuthenticated ? "/dashboard" : "/register"}
                  className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full font-semibold text-white bg-[#C74634] hover:bg-[#9E3529] shadow-warm transition-all transform hover:-translate-y-0.5 text-base"
                >
                  {isAuthenticated ? 'Go to Dashboard' : 'Build My Plan'}
                  <ArrowRight className="w-5 h-5" />
                </Link>

                <button
                  onClick={() => setDemoModalOpen(true)}
                  className="inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-full font-semibold text-[#49362E] bg-[#FFF9F1] hover:bg-[#F4E2D9] border border-[#E5D8CB] shadow-soft transition-all text-base"
                >
                  <div className="w-7 h-7 rounded-full bg-[#F4E2D9] flex items-center justify-center text-[#C74634]">
                    <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                  </div>
                  Watch Demo
                </button>
              </div>

              {/* 3 Value Propositions */}
              <div className="pt-8 border-t border-[#E5D8CB]/80 grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-[#FFF9F1] border border-[#E5D8CB] text-[#C74634] shrink-0">
                    <Target className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-[#49362E]">Set Goals</h2>
                    <p className="text-xs text-[#79675E]">Plan your future</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-[#FFF9F1] border border-[#E5D8CB] text-[#C74634] shrink-0">
                    <Search className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-[#49362E]">Find Opportunities</h2>
                    <p className="text-xs text-[#79675E]">Real-world ideas</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-[#FFF9F1] border border-[#E5D8CB] text-[#C74634] shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-[#49362E]">Take Action</h2>
                    <p className="text-xs text-[#79675E]">Step-by-step guidance</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Illustration & Floating Cards */}
            <div className="lg:col-span-6 relative flex items-center justify-center">
              <div className="relative w-full max-w-lg aspect-square flex items-center justify-center">
                {/* Central Illustration Composition (Warm FinTech Scene) */}
                <div className="w-72 sm:w-88 h-72 sm:h-88 rounded-3xl bg-linear-to-tr from-[#E7BFA9] via-[#FFF9F1] to-[#F4E2D9] border-2 border-[#E5D8CB] shadow-2xl relative flex flex-col items-center justify-center p-6 overflow-hidden">
                  {/* Subtle potted plant illustration motif */}
                  <div className="absolute -bottom-4 right-4 opacity-75 pointer-events-none">
                    <svg width="110" height="130" viewBox="0 0 100 120" fill="none">
                      <path d="M50 110 L50 40" stroke="#356B4B" strokeWidth="4" strokeLinecap="round" />
                      <ellipse cx="40" cy="50" rx="18" ry="10" transform="rotate(-30 40 50)" fill="#DCE8DE" stroke="#356B4B" strokeWidth="2" />
                      <ellipse cx="60" cy="65" rx="16" ry="9" transform="rotate(25 60 65)" fill="#DCE8DE" stroke="#356B4B" strokeWidth="2" />
                      <ellipse cx="42" cy="80" rx="14" ry="8" transform="rotate(-20 42 80)" fill="#DCE8DE" stroke="#356B4B" strokeWidth="2" />
                      <rect x="35" y="95" width="30" height="25" rx="4" fill="#C74634" />
                    </svg>
                  </div>

                  {/* Character working on laptop illustration motif */}
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="w-20 h-20 rounded-full bg-[#E7BFA9] border-2 border-[#D9A28F] flex items-center justify-center relative">
                      <div className="w-16 h-16 rounded-full bg-[#FFF9F1] flex items-center justify-center overflow-hidden">
                        {/* Minimalist face & glasses */}
                        <div className="w-8 h-2.5 border-b-2 border-[#49362E] rounded-full" />
                      </div>
                      <div className="absolute -top-1 w-20 h-8 bg-[#49362E] rounded-t-full" />
                    </div>
                    {/* Torso & laptop */}
                    <div className="w-32 h-20 bg-[#C74634] rounded-t-2xl mt-2 flex flex-col items-center justify-start pt-3">
                      <div className="w-24 h-12 bg-[#FFF9F1] rounded-t-md border border-[#E5D8CB] shadow-xs flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-[#356B4B]" />
                      </div>
                    </div>
                    <div className="w-40 h-3 bg-[#49362E] rounded-full" />
                  </div>

                  <div className="absolute top-4 left-6 text-left">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#79675E] bg-[#FFF9F1] px-2 py-0.5 rounded-full border border-[#E5D8CB]">
                      Sample Illustration
                    </span>
                  </div>
                </div>

                {/* Floating Card 1: Savings Goal (Top-Left) */}
                <div className="absolute -top-4 -left-4 sm:left-0 bg-[#FFF9F1] border border-[#E5D8CB] rounded-2xl p-4 shadow-warm w-48 text-left animate-pulse duration-1000">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-[#79675E]">Savings Goal</span>
                    <span className="text-[10px] font-semibold text-[#356B4B] bg-[#DCE8DE] px-1.5 py-0.5 rounded">42%</span>
                  </div>
                  <div className="text-lg font-bold text-[#49362E]">₹2,10,000 <span className="text-xs text-[#79675E] font-normal">/ ₹5,00,000</span></div>
                  <div className="w-full bg-[#E5D8CB] h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-[#C74634] h-full rounded-full w-[42%]" />
                  </div>
                </div>

                {/* Floating Card 2: Monthly Surplus (Top-Right) */}
                <div className="absolute -top-6 -right-2 sm:right-2 bg-[#FFF9F1] border border-[#E5D8CB] rounded-2xl p-3.5 shadow-warm w-44 text-left">
                  <span className="text-xs font-bold text-[#79675E]">Monthly Surplus</span>
                  <div className="text-lg font-bold text-[#356B4B] mt-0.5">+₹32,000 <span className="text-xs font-normal text-[#79675E]">/mo</span></div>
                  <p className="text-[10px] text-[#79675E] mt-1">Healthy buffer for launch</p>
                </div>

                {/* Floating Card 3: Opportunities (Bottom-Left) */}
                <div className="absolute -bottom-6 -left-4 sm:left-4 bg-[#FFF9F1] border border-[#E5D8CB] rounded-2xl p-3.5 shadow-warm w-52 text-left">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[#F4E2D9] flex items-center justify-center text-[#C74634]">
                      <Compass className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#49362E]">Opportunities</div>
                      <div className="text-[10px] text-[#356B4B] font-semibold">3 High Skill Fits Found</div>
                    </div>
                  </div>
                </div>

                {/* Floating Card 4: Roadmap Milestone (Bottom-Right) */}
                <div className="absolute -bottom-4 -right-2 sm:right-2 bg-[#FFF9F1] border border-[#E5D8CB] rounded-2xl p-4 shadow-warm w-48 text-left">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#C74634] mb-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Your Roadmap</span>
                  </div>
                  <div className="text-xs font-semibold text-[#49362E]">Stage 2: Validation</div>
                  <p className="text-[10px] text-[#79675E] mt-0.5">5 Interviews Scheduled</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* HOW FINPATH WORKS                                             */}
      {/* ============================================================ */}
      <section id="how-it-works" className="py-20 bg-[#FBF5EC] border-b border-[#E5D8CB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-2xl mx-auto mb-16">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#49362E] tracking-tight">
              How FinPath Works
            </h2>
            <p className="mt-3 text-base sm:text-lg text-[#79675E]">
              A simple process to move from your current situation to a brighter financial future.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left relative">
            {/* Step 1 */}
            <div className="bg-[#FFF9F1] p-7 rounded-2xl border border-[#E5D8CB] shadow-soft relative group hover:border-[#C74634]/60 transition-all">
              <div className="flex items-center justify-between mb-5">
                <span className="w-9 h-9 rounded-full bg-[#C74634] text-white flex items-center justify-center font-bold text-sm">
                  1
                </span>
                <span className="text-xs font-semibold text-[#79675E] bg-[#F4E2D9] px-2.5 py-1 rounded-full">
                  Profile
                </span>
              </div>
              <h3 className="font-display text-xl font-bold text-[#49362E] mb-2">Tell us about you</h3>
              <p className="text-sm text-[#79675E] leading-relaxed">
                Share your income, expenses, goals, and skills. We analyze your baseline surplus safely.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-[#FFF9F1] p-7 rounded-2xl border border-[#E5D8CB] shadow-soft relative group hover:border-[#C74634]/60 transition-all">
              <div className="flex items-center justify-between mb-5">
                <span className="w-9 h-9 rounded-full bg-[#C74634] text-white flex items-center justify-center font-bold text-sm">
                  2
                </span>
                <span className="text-xs font-semibold text-[#79675E] bg-[#F4E2D9] px-2.5 py-1 rounded-full">
                  Budget
                </span>
              </div>
              <h3 className="font-display text-xl font-bold text-[#49362E] mb-2">Get your financial plan</h3>
              <p className="text-sm text-[#79675E] leading-relaxed">
                See your savings goals, budget, and growth potential calculated with deterministic math.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-[#FFF9F1] p-7 rounded-2xl border border-[#E5D8CB] shadow-soft relative group hover:border-[#C74634]/60 transition-all">
              <div className="flex items-center justify-between mb-5">
                <span className="w-9 h-9 rounded-full bg-[#C74634] text-white flex items-center justify-center font-bold text-sm">
                  3
                </span>
                <span className="text-xs font-semibold text-[#79675E] bg-[#F4E2D9] px-2.5 py-1 rounded-full">
                  Discovery
                </span>
              </div>
              <h3 className="font-display text-xl font-bold text-[#49362E] mb-2">Discover opportunities</h3>
              <p className="text-sm text-[#79675E] leading-relaxed">
                Find real problems you could solve using your skills, with transparent startup cost estimates.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-[#FFF9F1] p-7 rounded-2xl border border-[#E5D8CB] shadow-soft relative group hover:border-[#C74634]/60 transition-all">
              <div className="flex items-center justify-between mb-5">
                <span className="w-9 h-9 rounded-full bg-[#C74634] text-white flex items-center justify-center font-bold text-sm">
                  4
                </span>
                <span className="text-xs font-semibold text-[#79675E] bg-[#F4E2D9] px-2.5 py-1 rounded-full">
                  Action
                </span>
              </div>
              <h3 className="font-display text-xl font-bold text-[#49362E] mb-2">Take action</h3>
              <p className="text-sm text-[#79675E] leading-relaxed">
                Follow a personalized roadmap and track your progress milestone by milestone.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* EXPLORE OPPORTUNITIES SECTION                                */}
      {/* ============================================================ */}
      <section className="py-20 border-b border-[#E5D8CB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-bold tracking-wider uppercase text-[#C74634]">Opportunity Catalog</span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#49362E] mt-1">
                Turn your skills into real opportunities.
              </h2>
            </div>
            <Link
              to="/opportunities"
              className="mt-4 md:mt-0 inline-flex items-center gap-1.5 font-bold text-[#C74634] hover:text-[#9E3529] transition-colors"
            >
              Explore All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sampleOpportunities.map((opp) => (
              <div
                key={opp.id}
                className="bg-[#FFF9F1] rounded-2xl p-6 border border-[#E5D8CB] shadow-soft flex flex-col justify-between hover:border-[#C74634]/60 transition-all text-left"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className="font-semibold text-[#79675E] bg-[#F4E2D9] px-2 py-0.5 rounded-full">
                      {opp.category}
                    </span>
                    <span className="font-bold text-[#356B4B] bg-[#DCE8DE] px-2 py-0.5 rounded-full">
                      Fit Score: {opp.score}
                    </span>
                  </div>

                  <h3 className="font-display text-xl font-bold text-[#49362E] mb-2">{opp.title}</h3>
                  <p className="text-xs text-[#79675E] mb-3">
                    <strong className="text-[#49362E]">Target Customer:</strong> {opp.target}
                  </p>
                  <p className="text-sm text-[#79675E] leading-relaxed mb-4">{opp.description}</p>
                </div>

                <div className="pt-4 border-t border-[#E5D8CB] space-y-2.5">
                  <div className="text-xs text-[#79675E]">
                    <span className="font-semibold text-[#49362E]">Relevant Skills:</span> {opp.skills}
                  </div>
                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-[#79675E]">
                      Startup Cost: <strong className="text-[#49362E]">{opp.cost}</strong>
                    </span>
                    <span className="text-[#9E3529] font-medium bg-[#F4E2D9] px-2 py-0.5 rounded">
                      {opp.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* FEATURES SECTION                                             */}
      {/* ============================================================ */}
      <section id="features" className="py-20 bg-[#FBF5EC] border-b border-[#E5D8CB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-2xl mx-auto mb-16">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#49362E] tracking-tight">
              Engineered for Practical Financial Growth
            </h2>
            <p className="mt-3 text-base sm:text-lg text-[#79675E]">
              Every tool in FinPath is focused on actionable numbers, customer truth, and steady execution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
            <div className="bg-[#FFF9F1] p-6 rounded-2xl border border-[#E5D8CB] shadow-soft">
              <div className="w-12 h-12 rounded-xl bg-[#F4E2D9] flex items-center justify-center text-[#C74634] mb-4">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="font-display text-xl font-bold text-[#49362E] mb-2">Financial Goal Planning</h3>
              <p className="text-sm text-[#79675E] leading-relaxed">
                Set target savings, emergency funds, or debt payoffs with exact timelines and required monthly contribution breakdowns.
              </p>
            </div>

            <div className="bg-[#FFF9F1] p-6 rounded-2xl border border-[#E5D8CB] shadow-soft">
              <div className="w-12 h-12 rounded-xl bg-[#DCE8DE] flex items-center justify-center text-[#356B4B] mb-4">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="font-display text-xl font-bold text-[#49362E] mb-2">Budget & Surplus Analysis</h3>
              <p className="text-sm text-[#79675E] leading-relaxed">
                Deterministic calculations that prevent double-counting debt, calculate real disposable income, and flag deficits early.
              </p>
            </div>

            <div className="bg-[#FFF9F1] p-6 rounded-2xl border border-[#E5D8CB] shadow-soft">
              <div className="w-12 h-12 rounded-xl bg-[#F4E2D9] flex items-center justify-center text-[#C74634] mb-4">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="font-display text-xl font-bold text-[#49362E] mb-2">Opportunity Discovery</h3>
              <p className="text-sm text-[#79675E] leading-relaxed">
                Discover unvalidated problems matching your skills, available hours, and startup budget, with transparent 0-100 fit scores.
              </p>
            </div>

            <div className="bg-[#FFF9F1] p-6 rounded-2xl border border-[#E5D8CB] shadow-soft">
              <div className="w-12 h-12 rounded-xl bg-[#E7BFA9]/40 flex items-center justify-center text-[#9E3529] mb-4">
                <Sliders className="w-6 h-6" />
              </div>
              <h3 className="font-display text-xl font-bold text-[#49362E] mb-2">Revenue & Feasibility Calculator</h3>
              <p className="text-sm text-[#79675E] leading-relaxed">
                Test conservative, base, and optimistic scenarios with customer acquisition costs, break-even targets, and cost recovery timelines.
              </p>
            </div>

            <div className="bg-[#FFF9F1] p-6 rounded-2xl border border-[#E5D8CB] shadow-soft">
              <div className="w-12 h-12 rounded-xl bg-[#F4E2D9] flex items-center justify-center text-[#C74634] mb-4">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="font-display text-xl font-bold text-[#49362E] mb-2">Personalized Roadmaps</h3>
              <p className="text-sm text-[#79675E] leading-relaxed">
                Structured 3-, 6-, or 12-month plans guiding you from customer interviews to MVP launch, with daily priority suggestions.
              </p>
            </div>

            <div className="bg-[#FFF9F1] p-6 rounded-2xl border border-[#E5D8CB] shadow-soft">
              <div className="w-12 h-12 rounded-xl bg-[#DCE8DE] flex items-center justify-center text-[#356B4B] mb-4">
                <IndianRupee className="w-6 h-6" />
              </div>
              <h3 className="font-display text-xl font-bold text-[#49362E] mb-2">Separate Business & Personal Finances</h3>
              <p className="text-sm text-[#79675E] leading-relaxed">
                Clean transaction management distinguishing personal living expenses from actual business revenue, costs, and net margin.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* HOW THE ROADMAP WORKS SECTION                                */}
      {/* ============================================================ */}
      <section id="roadmap" className="py-20 border-b border-[#E5D8CB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-2xl mx-auto mb-16">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#49362E]">
              How the 12-Month Roadmap Works
            </h2>
            <p className="mt-3 text-base text-[#79675E]">
              Milestones adapt to your target timeline, hours, and budget. You only scale when real demand exists.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-left">
            <div className="bg-[#FFF9F1] p-5 rounded-xl border border-[#E5D8CB]">
              <span className="text-xs font-bold text-[#C74634] uppercase tracking-wider">Phase 1</span>
              <h3 className="font-display text-lg font-bold text-[#49362E] mt-1">Validate</h3>
              <p className="text-xs text-[#79675E] mt-2 leading-relaxed">
                Interview 5 prospective customers. Document friction points and verify willingness to pay.
              </p>
            </div>

            <div className="bg-[#FFF9F1] p-5 rounded-xl border border-[#E5D8CB]">
              <span className="text-xs font-bold text-[#C74634] uppercase tracking-wider">Phase 2</span>
              <h3 className="font-display text-lg font-bold text-[#49362E] mt-1">Build MVP</h3>
              <p className="text-xs text-[#79675E] mt-2 leading-relaxed">
                Create the minimal working deliverable without expensive tooling or complex features.
              </p>
            </div>

            <div className="bg-[#FFF9F1] p-5 rounded-xl border border-[#E5D8CB]">
              <span className="text-xs font-bold text-[#C74634] uppercase tracking-wider">Phase 3</span>
              <h3 className="font-display text-lg font-bold text-[#49362E] mt-1">Test with Pilots</h3>
              <p className="text-xs text-[#79675E] mt-2 leading-relaxed">
                Onboard 2 founding pilot clients. Collect detailed testimonials and measure actual hours.
              </p>
            </div>

            <div className="bg-[#FFF9F1] p-5 rounded-xl border border-[#E5D8CB]">
              <span className="text-xs font-bold text-[#C74634] uppercase tracking-wider">Phase 4</span>
              <h3 className="font-display text-lg font-bold text-[#49362E] mt-1">Improve Offer</h3>
              <p className="text-xs text-[#79675E] mt-2 leading-relaxed">
                Standardize processes, resolve edge cases, and refine pricing based on proven unit economics.
              </p>
            </div>

            <div className="bg-[#FFF9F1] p-5 rounded-xl border border-[#E5D8CB]">
              <span className="text-xs font-bold text-[#C74634] uppercase tracking-wider">Phase 5</span>
              <h3 className="font-display text-lg font-bold text-[#49362E] mt-1">Scale Sustainably</h3>
              <p className="text-xs text-[#79675E] mt-2 leading-relaxed">
                Expand customer acquisition channels only when revenue and operating profit support it.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* TRUST & RESPONSIBLE PLANNING                                 */}
      {/* ============================================================ */}
      <section id="trust" className="py-16 bg-[#FFF9F1] border-b border-[#E5D8CB]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F4E2D9] text-xs font-semibold text-[#9E3529]">
            <ShieldAlert className="w-4 h-4 text-[#C74634]" />
            RESPONSIBLE PLANNING PRINCIPLE
          </div>

          <h2 className="font-display text-3xl font-bold text-[#49362E]">
            FinPath is built on transparency, not hype.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left pt-4">
            <div className="p-5 rounded-xl bg-[#F6E9D8] border border-[#E5D8CB]">
              <h3 className="font-bold text-sm text-[#49362E] mb-1">Estimates, not guarantees</h3>
              <p className="text-xs text-[#79675E] leading-relaxed">
                All financial projections and revenue calculators are hypothetical models. FinPath does not assure income or guarantee business success.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[#F6E9D8] border border-[#E5D8CB]">
              <h3 className="font-bold text-sm text-[#49362E] mb-1">Evidence before expenditure</h3>
              <p className="text-xs text-[#79675E] leading-relaxed">
                We strongly advise speaking directly with real prospective customers and verifying willingness to pay before investing significant personal money.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* FAQ SECTION                                                  */}
      {/* ============================================================ */}
      <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-display text-3xl font-bold text-center text-[#49362E] mb-12">
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-[#FFF9F1] rounded-xl border border-[#E5D8CB] overflow-hidden transition-all"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full px-6 py-4 flex items-center justify-between text-left font-semibold text-[#49362E] hover:text-[#C74634]"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-[#79675E] transition-transform ${
                    openFaq === idx ? 'transform rotate-180' : ''
                  }`}
                />
              </button>
              {openFaq === idx && (
                <div className="px-6 pb-5 text-sm text-[#79675E] leading-relaxed border-t border-[#E5D8CB]/50 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/* DEMO EXPERIENCE MODAL                                        */}
      {/* ============================================================ */}
      <Modal
        isOpen={demoModalOpen}
        onClose={() => setDemoModalOpen(false)}
        title="Explore FinPath Demo Experience"
        maxWidth="xl"
      >
        <div className="space-y-5 text-left">
          <p className="text-sm text-[#79675E] leading-relaxed">
            Experience the complete FinPath journey with sample financial profiles, an active emergency & launch goal, pre-seeded opportunities, and interactive roadmaps.
          </p>

          <div className="bg-[#F6E9D8] p-4 rounded-xl border border-[#E5D8CB] space-y-2">
            <div className="text-xs font-bold text-[#49362E] uppercase tracking-wider">Demo User Profile:</div>
            <div className="grid grid-cols-2 gap-2 text-xs text-[#79675E]">
              <div>Name: <strong className="text-[#49362E]">Alex Chen</strong></div>
              <div>Take-home Income: <strong className="text-[#49362E]">₹75,000/mo</strong></div>
              <div>Goal: <strong className="text-[#49362E]">₹5,00,000 Reserve</strong></div>
              <div>Monthly Surplus: <strong className="text-[#356B4B]">+₹32,000/mo</strong></div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              onClick={() => setDemoModalOpen(false)}
              className="px-5 py-2.5 rounded-full font-semibold text-sm text-[#79675E] hover:text-[#49362E]"
            >
              Cancel
            </button>
            <button
              onClick={handleStartDemo}
              className="px-6 py-2.5 rounded-full font-semibold text-sm text-white bg-[#C74634] hover:bg-[#9E3529] shadow-sm transition-all"
            >
              Launch Interactive Demo →
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
