import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { formatCurrency } from '../utils/formatters';
import {
  User,
  IndianRupee,
  Target,
  Wrench,
  Search,
  Check,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export const OnboardingPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { user, updateUserContext } = useAuth();
  const navigate = useNavigate();

  // Step 1: Personal Profile
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [ageRange, setAgeRange] = useState('25-34');
  const [country, setCountry] = useState('India');
  const [stateRegion, setStateRegion] = useState('');
  const [educationStatus, setEducationStatus] = useState('Employed Full-time');
  const [occupation, setOccupation] = useState('');

  // Step 2: Financial Profile
  const [income, setIncome] = useState<number>(65000);
  const [essentialExpenses, setEssentialExpenses] = useState<number>(30000);
  const [discretionaryExpenses, setDiscretionaryExpenses] = useState<number>(8000);
  const [debtRepayments, setDebtRepayments] = useState<number>(5000);
  const [currentSavings, setCurrentSavings] = useState<number>(120000);
  const [otherIncome, setOtherIncome] = useState<number>(0);
  const [startupBudget, setStartupBudget] = useState<number>(25000);
  const [debtIncluded, setDebtIncluded] = useState<boolean>(false);

  // Step 3: Financial Goal
  const [goalType, setGoalType] = useState('EMERGENCY_FUND');
  const [goalTitle, setGoalTitle] = useState('Build 6-Month Emergency & Launch Fund');
  const [targetAmount, setTargetAmount] = useState<number>(500000);
  const [currentAllocated, setCurrentAllocated] = useState<number>(120000);
  const [deadlineMonths, setDeadlineMonths] = useState<number>(6);
  const priority = 'HIGH';
  const currency = 'INR';

  // Step 4: Skills & Capabilities
  const [skills, setSkills] = useState('Basic Web Design, Customer Support, Spreadsheet Automation');
  const [experienceLevel, setExperienceLevel] = useState('Intermediate');
  const [availableHours, setAvailableHours] = useState<number>(10);
  const [equipment, setEquipment] = useState('Laptop, reliable Wi-Fi, smartphone');
  const willingnessToLearn = true;
  const [preferredModel, setPreferredModel] = useState('Productized Service / Freelance');

  // Step 5: Problem Discovery
  const [noticedProblems, setNoticedProblems] = useState('');
  const [targetGroup, setTargetGroup] = useState('Local neighborhood small businesses');
  const [priorConversations, setPriorConversations] = useState(false);

  // Helper calculation for Step 2 preview:
  const monthlySurplus = income + otherIncome - (essentialExpenses + discretionaryExpenses + (debtIncluded ? 0 : debtRepayments));

  const handleNext = () => {
    setError(null);
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    setError(null);
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleFinish = async () => {
    try {
      setSaving(true);
      setError(null);

      // Save user profile
      await api.updateProfile({
        displayName,
        ageRange,
        country,
        stateRegion,
        educationEmploymentStatus: educationStatus,
        occupation,
        skills,
        experienceLevel,
        availableHoursPerWeek: availableHours,
        equipmentResources: equipment,
        willingnessToLearn,
        preferredIncomeModel: preferredModel,
        onboardingCompleted: true,
      });

      // Save financial profile
      await api.updateFinancialProfile({
        monthlyTakeHomeIncome: income,
        monthlyEssentialExpenses: essentialExpenses,
        monthlyDiscretionaryExpenses: discretionaryExpenses,
        monthlyDebtRepayments: debtRepayments,
        currentSavings,
        otherRecurringIncome: otherIncome,
        availableStartupBudget: startupBudget,
        debtIncludedInExpenses: debtIncluded,
      });

      // Calculate target deadline date
      const targetDate = new Date();
      targetDate.setMonth(targetDate.getMonth() + deadlineMonths);
      const formattedDeadline = targetDate.toISOString().split('T')[0];

      // Save financial goal
      const createdGoal = await api.createGoal({
        title: goalTitle,
        goalType,
        targetAmount,
        currentAllocated,
        deadline: formattedDeadline,
        priority,
        currency,
      });

      // Generate initial personalized roadmap based on goal
      await api.generateRoadmap({
        goalId: createdGoal.id,
        durationMonths: deadlineMonths,
      });

      updateUserContext({ onboardingCompleted: true, displayName });
      navigate('/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save onboarding progress.');
    } finally {
      setSaving(false);
    }
  };

  const steps = [
    { number: 1, title: 'Profile', icon: User },
    { number: 2, title: 'Finances', icon: IndianRupee },
    { number: 3, title: 'Goal', icon: Target },
    { number: 4, title: 'Skills', icon: Wrench },
    { number: 5, title: 'Problems', icon: Search },
  ];

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-left">
      {/* Wizard Header & Progress Bar */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-[#49362E]">Set Up Your FinPath</h1>
        <p className="mt-1 text-sm text-[#79675E]">
          Step {currentStep} of 5 — Answer a few questions to build your customized plan and discover matching opportunities.
        </p>

        {/* Stepper visual */}
        <div className="mt-6 flex items-center justify-between relative">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-[#E5D8CB] -translate-y-1/2 -z-0" />
          <div
            className="absolute top-1/2 left-0 h-1 bg-[#C74634] -translate-y-1/2 transition-all duration-300 -z-0"
            style={{ width: `${((currentStep - 1) / 4) * 100}%` }}
          />

          {steps.map((s) => {
            const Icon = s.icon;
            const isDone = currentStep > s.number;
            const isCurrent = currentStep === s.number;

            return (
              <div key={s.number} className="relative z-10 flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => s.number < currentStep && setCurrentStep(s.number)}
                  disabled={s.number > currentStep}
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                    isDone
                      ? 'bg-[#356B4B] text-white shadow-xs'
                      : isCurrent
                      ? 'bg-[#C74634] text-white ring-4 ring-[#C74634]/20 shadow-md scale-105'
                      : 'bg-[#FFF9F1] text-[#79675E] border-2 border-[#E5D8CB]'
                  }`}
                >
                  {isDone ? <Check className="w-5 h-5" /> : <Icon className="w-4 h-4" />}
                </button>
                <span className={`text-xs mt-1.5 font-semibold ${isCurrent ? 'text-[#C74634]' : 'text-[#79675E]'}`}>
                  {s.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-[#F4E2D9] border border-[#C74634]/30 text-xs text-[#9E3529] font-medium">
          {error}
        </div>
      )}

      {/* Wizard Card Body */}
      <div className="bg-[#FFF9F1] rounded-3xl p-6 sm:p-10 border border-[#E5D8CB] shadow-soft transition-all">
        {/* ========================================================= */}
        {/* STEP 1: PERSONAL PROFILE                                  */}
        {/* ========================================================= */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="font-display text-2xl font-bold text-[#49362E]">Personal Profile</h2>
              <p className="text-sm text-[#79675E] mt-1">
                Help us personalize your journey and regional opportunity matches.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-[#49362E] uppercase tracking-wider mb-1.5">
                  Display Name
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g. Alex Chen"
                  className="w-full px-4 py-3 rounded-xl border border-[#E5D8CB] bg-white text-sm text-[#49362E] focus:outline-hidden focus:border-[#C74634]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#49362E] uppercase tracking-wider mb-1.5">
                  Age Range
                </label>
                <select
                  value={ageRange}
                  onChange={(e) => setAgeRange(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#E5D8CB] bg-white text-sm text-[#49362E] focus:outline-hidden focus:border-[#C74634]"
                >
                  <option value="18-24">18 - 24 years old (Student / Early Career)</option>
                  <option value="25-34">25 - 34 years old</option>
                  <option value="35-44">35 - 44 years old</option>
                  <option value="45+">45+ years old</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#49362E] uppercase tracking-wider mb-1.5">
                  Country
                </label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="e.g. United States, India, Canada"
                  className="w-full px-4 py-3 rounded-xl border border-[#E5D8CB] bg-white text-sm text-[#49362E] focus:outline-hidden focus:border-[#C74634]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#49362E] uppercase tracking-wider mb-1.5">
                  State / Region / Province
                </label>
                <input
                  type="text"
                  value={stateRegion}
                  onChange={(e) => setStateRegion(e.target.value)}
                  placeholder="e.g. California, Ontario, Maharashtra"
                  className="w-full px-4 py-3 rounded-xl border border-[#E5D8CB] bg-white text-sm text-[#49362E] focus:outline-hidden focus:border-[#C74634]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#49362E] uppercase tracking-wider mb-1.5">
                  Current Status
                </label>
                <select
                  value={educationStatus}
                  onChange={(e) => setEducationStatus(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#E5D8CB] bg-white text-sm text-[#49362E] focus:outline-hidden focus:border-[#C74634]"
                >
                  <option value="Student">Student (Undergraduate / Graduate)</option>
                  <option value="Employed Full-time">Employed Full-time</option>
                  <option value="Employed Part-time">Employed Part-time</option>
                  <option value="Freelancer">Freelancer / Independent Contractor</option>
                  <option value="Unemployed">Seeking Employment / Between Roles</option>
                  <option value="Aspiring Entrepreneur">Aspiring Entrepreneur</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#49362E] uppercase tracking-wider mb-1.5">
                  Occupation / Field of Study (Optional)
                </label>
                <input
                  type="text"
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  placeholder="e.g. Computer Science student, Retail assistant"
                  className="w-full px-4 py-3 rounded-xl border border-[#E5D8CB] bg-white text-sm text-[#49362E] focus:outline-hidden focus:border-[#C74634]"
                />
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* STEP 2: FINANCIAL PROFILE                                 */}
        {/* ========================================================= */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="font-display text-2xl font-bold text-[#49362E]">Financial Baseline</h2>
              <p className="text-sm text-[#79675E] mt-1">
                Enter your monthly cash flow numbers. We evaluate your baseline surplus accurately without speculative investment returns.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-[#49362E] uppercase tracking-wider mb-1.5">
                  Monthly Take-Home Income (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  value={income}
                  onChange={(e) => setIncome(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl border border-[#E5D8CB] bg-white text-sm text-[#49362E] focus:outline-hidden focus:border-[#C74634]"
                />
                <span className="text-[11px] text-[#79675E]">Net income in your bank account each month</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#49362E] uppercase tracking-wider mb-1.5">
                  Other Monthly Income (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  step="500"
                  value={otherIncome}
                  onChange={(e) => setOtherIncome(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl border border-[#E5D8CB] bg-white text-sm text-[#49362E] focus:outline-hidden focus:border-[#C74634]"
                />
                <span className="text-[11px] text-[#79675E]">Side projects, consulting, or allowances</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#49362E] uppercase tracking-wider mb-1.5">
                  Monthly Essential Expenses (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  step="500"
                  value={essentialExpenses}
                  onChange={(e) => setEssentialExpenses(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl border border-[#E5D8CB] bg-white text-sm text-[#49362E] focus:outline-hidden focus:border-[#C74634]"
                />
                <span className="text-[11px] text-[#79675E]">Rent, groceries, utilities, transit, medicine</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#49362E] uppercase tracking-wider mb-1.5">
                  Monthly Discretionary Expenses (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  step="500"
                  value={discretionaryExpenses}
                  onChange={(e) => setDiscretionaryExpenses(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl border border-[#E5D8CB] bg-white text-sm text-[#49362E] focus:outline-hidden focus:border-[#C74634]"
                />
                <span className="text-[11px] text-[#79675E]">Dining out, subscriptions, leisure, shopping</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#49362E] uppercase tracking-wider mb-1.5">
                  Monthly Debt Repayments (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  step="500"
                  value={debtRepayments}
                  onChange={(e) => setDebtRepayments(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl border border-[#E5D8CB] bg-white text-sm text-[#49362E] focus:outline-hidden focus:border-[#C74634]"
                />
                <span className="text-[11px] text-[#79675E]">Student loans, EMIs, or credit card dues</span>
              </div>

              <div className="sm:col-span-2 p-3.5 bg-[#F6E9D8] rounded-xl border border-[#E5D8CB] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="debtIncludedCheck"
                    checked={debtIncluded}
                    onChange={(e) => setDebtIncluded(e.target.checked)}
                    className="w-4 h-4 text-[#C74634] rounded accent-[#C74634]"
                  />
                  <label htmlFor="debtIncludedCheck" className="text-xs font-semibold text-[#49362E] cursor-pointer">
                    Debt repayments are already included in Essential Expenses above
                  </label>
                </div>
                <span className="text-[11px] text-[#79675E] hidden sm:inline">(Prevents double counting)</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#49362E] uppercase tracking-wider mb-1.5">
                  Current Liquid Savings (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  value={currentSavings}
                  onChange={(e) => setCurrentSavings(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl border border-[#E5D8CB] bg-white text-sm text-[#49362E] focus:outline-hidden focus:border-[#C74634]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#49362E] uppercase tracking-wider mb-1.5">
                  Available Startup Budget (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  value={startupBudget}
                  onChange={(e) => setStartupBudget(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl border border-[#E5D8CB] bg-white text-sm text-[#49362E] focus:outline-hidden focus:border-[#C74634]"
                />
                <span className="text-[11px] text-[#79675E]">Money you can comfortably risk on initial tools/domains</span>
              </div>
            </div>

            {/* Live Monthly Surplus Badge */}
            <div className={`p-4 rounded-xl border flex items-center justify-between ${
              monthlySurplus >= 0 ? 'bg-[#DCE8DE] border-[#356B4B]/30 text-[#356B4B]' : 'bg-[#F4E2D9] border-[#C74634]/30 text-[#9E3529]'
            }`}>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider">Estimated Monthly Surplus / Buffer:</span>
                <div className="text-xl font-bold font-display mt-0.5">
                  {monthlySurplus >= 0 ? `+${formatCurrency(monthlySurplus)}` : formatCurrency(monthlySurplus)} / month
                </div>
              </div>
              <span className="text-xs font-medium">
                {monthlySurplus >= 0 ? 'Healthy baseline to commit to goals' : 'Expenses exceed income — adjustment needed'}
              </span>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* STEP 3: FINANCIAL GOAL                                    */}
        {/* ========================================================= */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="font-display text-2xl font-bold text-[#49362E]">Define Your Financial Target</h2>
              <p className="text-sm text-[#79675E] mt-1">
                FinPath uses your goal target amount and deadline to calculate your exact monthly requirement.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-[#49362E] uppercase tracking-wider mb-1.5">
                  Goal Title
                </label>
                <input
                  type="text"
                  value={goalTitle}
                  onChange={(e) => setGoalTitle(e.target.value)}
                  placeholder="e.g. 6-Month Emergency Fund, First ₹5,00,000 Client Revenue"
                  className="w-full px-4 py-3 rounded-xl border border-[#E5D8CB] bg-white text-sm text-[#49362E] focus:outline-hidden focus:border-[#C74634]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#49362E] uppercase tracking-wider mb-1.5">
                  Goal Type
                </label>
                <select
                  value={goalType}
                  onChange={(e) => setGoalType(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#E5D8CB] bg-white text-sm text-[#49362E] focus:outline-hidden focus:border-[#C74634]"
                >
                  <option value="EMERGENCY_FUND">Build an Emergency Fund</option>
                  <option value="SAVINGS">Save a Target Amount</option>
                  <option value="INCREASE_INCOME">Increase Monthly Income</option>
                  <option value="REDUCE_DEBT">Pay Off High-Interest Debt</option>
                  <option value="SMALL_BUSINESS">Launch a Micro-Business / Side Service</option>
                  <option value="EDUCATION">Fund Education / Certifications</option>
                  <option value="OTHER">Other Custom Goal</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#49362E] uppercase tracking-wider mb-1.5">
                  Target Amount (₹)
                </label>
                <input
                  type="number"
                  min="1000"
                  step="5000"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl border border-[#E5D8CB] bg-white text-sm text-[#49362E] focus:outline-hidden focus:border-[#C74634]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#49362E] uppercase tracking-wider mb-1.5">
                  Amount Already Allocated (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  value={currentAllocated}
                  onChange={(e) => setCurrentAllocated(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl border border-[#E5D8CB] bg-white text-sm text-[#49362E] focus:outline-hidden focus:border-[#C74634]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#49362E] uppercase tracking-wider mb-1.5">
                  Timeline / Duration
                </label>
                <select
                  value={deadlineMonths}
                  onChange={(e) => setDeadlineMonths(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl border border-[#E5D8CB] bg-white text-sm text-[#49362E] focus:outline-hidden focus:border-[#C74634]"
                >
                  <option value={3}>3 Months (Rapid sprint)</option>
                  <option value={6}>6 Months (Balanced milestone)</option>
                  <option value={12}>12 Months (Comprehensive annual plan)</option>
                </select>
              </div>
            </div>

            {/* Calculated Monthly Hurdle preview */}
            <div className="p-4 bg-[#F6E9D8] rounded-xl border border-[#E5D8CB] flex items-center justify-between text-xs">
              <span className="font-semibold text-[#49362E]">Required Average Monthly Contribution:</span>
              <span className="font-bold text-[#C74634] text-base">
                {formatCurrency(Math.max(0, Math.round((targetAmount - currentAllocated) / deadlineMonths)))}/mo
              </span>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* STEP 4: SKILLS & CAPABILITIES                             */}
        {/* ========================================================= */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="font-display text-2xl font-bold text-[#49362E]">Skills & Capabilities</h2>
              <p className="text-sm text-[#79675E] mt-1">
                Tell us what problems you can realistically solve and how many hours you have available.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#49362E] uppercase tracking-wider mb-1.5">
                  Your Skills (Technical, Design, Writing, Math, Sales, Organizing)
                </label>
                <textarea
                  rows={3}
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="e.g. Web design, Excel spreadsheets, social media copywriting, tutoring physics..."
                  className="w-full px-4 py-3 rounded-xl border border-[#E5D8CB] bg-white text-sm text-[#49362E] focus:outline-hidden focus:border-[#C74634]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-[#49362E] uppercase tracking-wider mb-1.5">
                    Experience Level
                  </label>
                  <select
                    value={experienceLevel}
                    onChange={(e) => setExperienceLevel(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[#E5D8CB] bg-white text-sm text-[#49362E] focus:outline-hidden focus:border-[#C74634]"
                  >
                    <option value="Beginner">Beginner (Foundational knowledge)</option>
                    <option value="Intermediate">Intermediate (Can deliver working projects)</option>
                    <option value="Advanced">Advanced (Proven practitioner)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#49362E] uppercase tracking-wider mb-1.5">
                    Available Hours Per Week
                  </label>
                  <select
                    value={availableHours}
                    onChange={(e) => setAvailableHours(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl border border-[#E5D8CB] bg-white text-sm text-[#49362E] focus:outline-hidden focus:border-[#C74634]"
                  >
                    <option value={5}>5 hours / week (Light evenings)</option>
                    <option value={10}>10 hours / week (Part-time focus)</option>
                    <option value={15}>15 hours / week (Active side hustle)</option>
                    <option value={20}>20+ hours / week (Half-time dedication)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#49362E] uppercase tracking-wider mb-1.5">
                    Preferred Model
                  </label>
                  <select
                    value={preferredModel}
                    onChange={(e) => setPreferredModel(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[#E5D8CB] bg-white text-sm text-[#49362E] focus:outline-hidden focus:border-[#C74634]"
                  >
                    <option value="Productized Service / Freelance">Productized Service / Freelancing</option>
                    <option value="Local Business Services">Local Community / Business Services</option>
                    <option value="Digital Products / Templates">Digital Assets & Guides</option>
                    <option value="Micro-SaaS">Micro-SaaS / Software Tool</option>
                    <option value="Undecided">Undecided / Open to Best Fit</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#49362E] uppercase tracking-wider mb-1.5">
                    Equipment & Tools
                  </label>
                  <input
                    type="text"
                    value={equipment}
                    onChange={(e) => setEquipment(e.target.value)}
                    placeholder="e.g. Laptop, smartphone, tablet"
                    className="w-full px-4 py-3 rounded-xl border border-[#E5D8CB] bg-white text-sm text-[#49362E] focus:outline-hidden focus:border-[#C74634]"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* STEP 5: PROBLEM DISCOVERY                                 */}
        {/* ========================================================= */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div>
              <h2 className="font-display text-2xl font-bold text-[#49362E]">Problem Discovery</h2>
              <p className="text-sm text-[#79675E] mt-1">
                The most sustainable businesses solve real customer headaches. These optional inputs help identify opportunities.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#49362E] uppercase tracking-wider mb-1.5">
                  Recurring problems you notice in small businesses, students, or households:
                </label>
                <textarea
                  rows={2}
                  value={noticedProblems}
                  onChange={(e) => setNoticedProblems(e.target.value)}
                  placeholder="e.g. Barbershops have clients who don't show up; clinics take phone bookings by hand..."
                  className="w-full px-4 py-3 rounded-xl border border-[#E5D8CB] bg-white text-sm text-[#49362E] focus:outline-hidden focus:border-[#C74634]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#49362E] uppercase tracking-wider mb-1.5">
                  Which customer group do you most want to help?
                </label>
                <input
                  type="text"
                  value={targetGroup}
                  onChange={(e) => setTargetGroup(e.target.value)}
                  placeholder="e.g. Independent salon owners, high school parents, freelance agencies"
                  className="w-full px-4 py-3 rounded-xl border border-[#E5D8CB] bg-white text-sm text-[#49362E] focus:outline-hidden focus:border-[#C74634]"
                />
              </div>

              <div className="p-3.5 bg-[#F6E9D8] rounded-xl border border-[#E5D8CB] flex items-center gap-3">
                <input
                  type="checkbox"
                  id="priorConversationsCheck"
                  checked={priorConversations}
                  onChange={(e) => setPriorConversations(e.target.checked)}
                  className="w-4 h-4 text-[#C74634] rounded accent-[#C74634]"
                />
                <label htmlFor="priorConversationsCheck" className="text-xs font-semibold text-[#49362E] cursor-pointer">
                  I have already spoken with at least one potential customer about this problem
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Wizard Footer Controls */}
        <div className="mt-10 pt-6 border-t border-[#E5D8CB] flex items-center justify-between">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentStep === 1 || saving}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full font-semibold text-sm text-[#79675E] hover:text-[#49362E] hover:bg-[#F4E2D9] disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>

          {currentStep < 5 ? (
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full font-semibold text-sm text-white bg-[#C74634] hover:bg-[#9E3529] shadow-sm transition-all transform hover:-translate-y-0.5"
            >
              Next Step
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              disabled={saving}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-semibold text-sm text-white bg-[#C74634] hover:bg-[#9E3529] shadow-warm transition-all transform hover:-translate-y-0.5 disabled:opacity-50"
            >
              {saving ? 'Creating Your Plan...' : 'Complete & View Dashboard'}
              <Sparkles className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
