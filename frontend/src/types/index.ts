export interface User {
  id: number;
  email: string;
  role: string;
  displayName: string;
  onboardingCompleted: boolean;
}

export interface UserProfile {
  displayName?: string;
  ageRange?: string;
  country?: string;
  stateRegion?: string;
  educationEmploymentStatus?: string;
  occupation?: string;
  skills?: string;
  experienceLevel?: string;
  interests?: string;
  availableHoursPerWeek?: number;
  equipmentResources?: string;
  willingnessToLearn?: boolean;
  preferredIncomeModel?: string;
  onboardingCompleted?: boolean;
}

export interface FinancialProfile {
  monthlyTakeHomeIncome?: number;
  monthlyEssentialExpenses?: number;
  monthlyDiscretionaryExpenses?: number;
  monthlyDebtRepayments?: number;
  currentSavings?: number;
  otherRecurringIncome?: number;
  availableStartupBudget?: number;
  debtIncludedInExpenses?: boolean;
}

export interface FinancialGoal {
  id?: number;
  goalType: string;
  title: string;
  targetAmount: number;
  currentAllocated: number;
  deadline: string;
  priority: string;
  currency: string;
  status?: string;
  progressPercentage?: number;
  remainingGap?: number;
  requiredMonthlyContribution?: number;
  monthsRemaining?: number;
}

export interface GoalAssessment {
  status: 'ACHIEVABLE' | 'POTENTIALLY_ACHIEVABLE' | 'UNLIKELY' | 'NOT_ASSESSABLE';
  statusLabel: string;
  explanation: string;
  monthlySurplus: number;
  requiredMonthlyContribution: number;
  monthlyShortfallOrSurplus: number;
  monthsRemaining: number;
  remainingGap: number;
  actionableRecommendations: string[];
  assumptions: string[];
}

export interface FinancialOverview {
  monthlyTakeHomeIncome: number;
  monthlyTotalExpenses: number;
  monthlyEssentialExpenses: number;
  monthlyDiscretionaryExpenses: number;
  monthlyDebtRepayments: number;
  monthlySurplus: number;
  currentSavings: number;
  availableStartupBudget: number;
  deficit: boolean;
  activeGoalAssessment?: GoalAssessment;
}

export interface OpportunityCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
}

export interface Opportunity {
  id: number;
  categoryId?: number;
  categoryName?: string;
  categoryIcon?: string;
  title: string;
  description: string;
  targetCustomer: string;
  potentialSolution: string;
  requiredSkills: string;
  initialCostMin: number;
  initialCostMax: number;
  pricingModel?: string;
  competitionNotes?: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  timeCommitment: string;
  businessModel: string;
  validationStatus: string;
  baseFitScore: number;
  userCalculatedFitScore: number;
  isFeatured?: boolean;
  isUserSubmitted?: boolean;
  isSavedByCurrentUser?: boolean;
  isApproved?: boolean;
  createdAt?: string;
}

export interface CustomerInterviewNote {
  id?: number;
  validationId?: number;
  intervieweeName?: string;
  customerType?: string;
  notes: string;
  confirmedProblem: boolean;
  willingnessToPayAmount: number;
  interviewDate: string;
}

export interface ValidationWorkspace {
  id: number;
  opportunityId: number;
  opportunityTitle: string;
  stage: string;
  problemStatement: string;
  targetCustomerProfile: string;
  hypothesesToTest: string;
  interviewQuestionSuggestions: string;
  peopleInterviewedCount: number;
  confirmedProblemCount: number;
  currentAlternatives: string;
  willingnessToPayEvidence: string;
  estimatedSolutionCost: number;
  validationNotes: string;
  nextExperiment: string;
  validationScore: number;
  interviewNotes?: CustomerInterviewNote[];
  updatedAt?: string;
}

export interface RevenueCalculationScenario {
  scenarioName: string;
  grossRevenue: number;
  totalVariableCosts: number;
  totalFixedCosts: number;
  totalCustomerAcquisitionCost: number;
  estimatedOperatingProfit: number;
  breakEvenCustomers: number;
  requiredLeads: number;
  initialFundingRequired: number;
  monthlyCashFlow: number;
  costRecoveryPeriodMonths: number;
  feasibilityNotice: string;
}

export interface ScenarioComparison {
  conservative: RevenueCalculationScenario;
  base: RevenueCalculationScenario;
  optimistic: RevenueCalculationScenario;
  disclaimer: string;
}

export interface RoadmapTask {
  id: number;
  roadmapId: number;
  stage: string;
  stageIndex: number;
  taskIndex: number;
  title: string;
  description: string;
  dueDate?: string;
  priority: string;
  estimatedHours: number;
  estimatedCost: number;
  isCompleted: boolean;
  completedAt?: string;
  successCriteria?: string;
  dependencies?: string;
}

export interface Roadmap {
  id: number;
  goalId?: number;
  goalTitle?: string;
  opportunityId?: number;
  opportunityTitle?: string;
  title: string;
  durationMonths: number;
  status: string;
  totalTasks: number;
  completedTasks: number;
  completionPercentage: number;
  tasks: RoadmapTask[];
  createdAt: string;
}

export interface DailyAction {
  taskId: number;
  title: string;
  stage: string;
  priority: string;
  estimatedHours: number;
  dueDate?: string;
  reason: string;
}

export interface Transaction {
  id: number;
  type: 'PERSONAL_INCOME' | 'PERSONAL_EXPENSE' | 'BUSINESS_INCOME' | 'BUSINESS_EXPENSE' | 'SAVINGS_CONTRIBUTION' | 'GOAL_ALLOCATION';
  category: string;
  amount: number;
  description?: string;
  transactionDate: string;
  goalId?: number;
  goalTitle?: string;
  createdAt: string;
}

export interface ProgressReport {
  goalCompletionPercentage: number;
  targetGoalAmount: number;
  currentGoalAllocated: number;
  plannedSavings: number;
  actualSavings: number;
  savingsVariance: number;
  totalRoadmapTasks: number;
  completedRoadmapTasks: number;
  taskCompletionPercentage: number;
  customerInterviewsCompleted: number;
  opportunitiesValidatedCount: number;
  actualPayingCustomersCount: number;
  actualBusinessRevenue: number;
  actualBusinessCosts: number;
  actualNetBusinessProfit: number;
  upcomingMilestones: RoadmapTask[];
  todayActions: DailyAction[];
  pacingStatus: 'AHEAD' | 'ON_TRACK' | 'SLIGHTLY_BEHIND' | 'OFF_TRACK';
  strategicRecommendations: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  notice?: string;
  error?: boolean;
}

export interface ChatResponse {
  reply: string;
  provider: string;
  educationalNotice: string;
  externalAiConfigured: boolean;
}

export interface ChatStatus {
  externalAiConfigured: boolean;
  provider: string;
  mode: string;
  maxCharacters: number;
}

