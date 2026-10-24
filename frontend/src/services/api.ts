import {
  User,
  UserProfile,
  FinancialProfile,
  FinancialGoal,
  FinancialOverview,
  GoalAssessment,
  Opportunity,
  OpportunityCategory,
  ValidationWorkspace,
  CustomerInterviewNote,
  ScenarioComparison,
  Roadmap,
  RoadmapTask,
  DailyAction,
  Transaction,
  ProgressReport,
  ChatResponse,
  ChatStatus
} from '../types';

const API_BASE = (import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/$/, '') : '') + '/api';

class ApiService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('finpath_token');
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('finpath_token', token);
    } else {
      localStorage.removeItem('finpath_token');
    }
  }

  getToken(): string | null {
    return this.token;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...((options.headers as Record<string, string>) || {}),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      this.setToken(null);
      window.dispatchEvent(new Event('finpath_auth_expired'));
    }

    const data = await response.json();

    if (!response.ok || (data.success === false && !data.data)) {
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }

    return (data.data !== undefined ? data.data : data) as T;
  }

  // Auth
  async register(body: { email: string; password: string; displayName?: string }) {
    return this.request<{ token: string; user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  async login(body: { email: string; password: string }) {
    return this.request<{ token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  async demoLogin() {
    return this.request<{ token: string; user: User }>('/auth/demo', {
      method: 'POST',
    });
  }

  async adminDemoLogin() {
    return this.request<{ token: string; user: User }>('/auth/admin-demo', {
      method: 'POST',
    });
  }

  // User Profile
  async getProfile(): Promise<UserProfile> {
    return this.request<UserProfile>('/profile');
  }

  async updateProfile(profile: UserProfile): Promise<UserProfile> {
    return this.request<UserProfile>('/profile', {
      method: 'PUT',
      body: JSON.stringify(profile),
    });
  }

  // Financial Profile
  async getFinancialProfile(): Promise<FinancialProfile> {
    return this.request<FinancialProfile>('/financial-profile');
  }

  async updateFinancialProfile(profile: FinancialProfile): Promise<FinancialProfile> {
    return this.request<FinancialProfile>('/financial-profile', {
      method: 'PUT',
      body: JSON.stringify(profile),
    });
  }

  // Goals
  async getGoals(): Promise<FinancialGoal[]> {
    return this.request<FinancialGoal[]>('/goals');
  }

  async getActiveGoal(): Promise<FinancialGoal> {
    return this.request<FinancialGoal>('/goals/active');
  }

  async createGoal(goal: Partial<FinancialGoal>): Promise<FinancialGoal> {
    return this.request<FinancialGoal>('/goals', {
      method: 'POST',
      body: JSON.stringify(goal),
    });
  }

  async updateGoal(id: number, goal: Partial<FinancialGoal>): Promise<FinancialGoal> {
    return this.request<FinancialGoal>(`/goals/${id}`, {
      method: 'PUT',
      body: JSON.stringify(goal),
    });
  }

  async deleteGoal(id: number): Promise<void> {
    return this.request<void>(`/goals/${id}`, { method: 'DELETE' });
  }

  async assessGoal(id: number): Promise<GoalAssessment> {
    return this.request<GoalAssessment>(`/goals/${id}/assess`);
  }

  // Financial Calculations & Dashboard Overview
  async getFinancialOverview(): Promise<FinancialOverview> {
    return this.request<FinancialOverview>('/calculations/overview');
  }

  // Opportunities
  async getPublicOpportunities(): Promise<Opportunity[]> {
    return this.request<Opportunity[]>('/opportunities/public');
  }

  async getCategories(): Promise<OpportunityCategory[]> {
    return this.request<OpportunityCategory[]>('/opportunities/categories');
  }

  async searchOpportunities(params?: {
    query?: string;
    categoryId?: number;
    difficulty?: string;
    validationStatus?: string;
  }): Promise<Opportunity[]> {
    const query = new URLSearchParams();
    if (params?.query) query.set('query', params.query);
    if (params?.categoryId) query.set('categoryId', params.categoryId.toString());
    if (params?.difficulty) query.set('difficulty', params.difficulty);
    if (params?.validationStatus) query.set('validationStatus', params.validationStatus);

    const queryString = query.toString() ? `?${query.toString()}` : '';
    return this.request<Opportunity[]>(`/opportunities${queryString}`);
  }

  async getOpportunity(id: number): Promise<Opportunity> {
    return this.request<Opportunity>(`/opportunities/${id}`);
  }

  async toggleSaveOpportunity(id: number): Promise<void> {
    return this.request<void>(`/opportunities/${id}/save`, { method: 'POST' });
  }

  async getSavedOpportunities(): Promise<Opportunity[]> {
    return this.request<Opportunity[]>('/opportunities/saved');
  }

  async submitOpportunity(opp: Partial<Opportunity>): Promise<Opportunity> {
    return this.request<Opportunity>('/opportunities/submit', {
      method: 'POST',
      body: JSON.stringify(opp),
    });
  }

  async compareOpportunities(ids: number[]): Promise<Opportunity[]> {
    return this.request<Opportunity[]>('/opportunities/compare', {
      method: 'POST',
      body: JSON.stringify(ids),
    });
  }

  // Opportunity Validation Workspace
  async getValidation(opportunityId: number): Promise<ValidationWorkspace> {
    return this.request<ValidationWorkspace>(`/validations/${opportunityId}`);
  }

  async updateValidation(opportunityId: number, data: Partial<ValidationWorkspace>): Promise<ValidationWorkspace> {
    return this.request<ValidationWorkspace>(`/validations/${opportunityId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async addInterviewNote(validationId: number, note: Partial<CustomerInterviewNote>): Promise<CustomerInterviewNote> {
    return this.request<CustomerInterviewNote>(`/validations/${validationId}/notes`, {
      method: 'POST',
      body: JSON.stringify(note),
    });
  }

  // Revenue & Feasibility Calculator
  async calculateRevenueScenarios(params: {
    pricePerCustomer: number;
    expectedCustomers: number;
    variableCostPerCustomer?: number;
    monthlyFixedExpenses?: number;
    initialSetupCosts?: number;
    customerAcquisitionCost?: number;
    qualifiedLeads?: number;
    conversionRate?: number;
  }): Promise<ScenarioComparison> {
    return this.request<ScenarioComparison>('/revenue-calculator/calculate', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  // Roadmap
  async getActiveRoadmap(): Promise<Roadmap> {
    return this.request<Roadmap>('/roadmaps/active');
  }

  async generateRoadmap(params: { goalId?: number; opportunityId?: number; durationMonths: number }): Promise<Roadmap> {
    return this.request<Roadmap>('/roadmaps/generate', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  async toggleRoadmapTask(taskId: number): Promise<RoadmapTask> {
    return this.request<RoadmapTask>(`/roadmaps/tasks/${taskId}/toggle`, {
      method: 'PATCH',
    });
  }

  async addCustomTask(roadmapId: number, task: Partial<RoadmapTask>): Promise<RoadmapTask> {
    return this.request<RoadmapTask>(`/roadmaps/${roadmapId}/tasks`, {
      method: 'POST',
      body: JSON.stringify(task),
    });
  }

  async getDailyActions(): Promise<DailyAction[]> {
    return this.request<DailyAction[]>('/roadmaps/daily-actions');
  }

  // Transactions
  async getTransactions(): Promise<Transaction[]> {
    return this.request<Transaction[]>('/transactions');
  }

  async getTransactionSummary(): Promise<Record<string, number>> {
    return this.request<Record<string, number>>('/transactions/summary');
  }

  async createTransaction(tx: Partial<Transaction>): Promise<Transaction> {
    return this.request<Transaction>('/transactions', {
      method: 'POST',
      body: JSON.stringify(tx),
    });
  }

  async updateTransaction(id: number, tx: Partial<Transaction>): Promise<Transaction> {
    return this.request<Transaction>(`/transactions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(tx),
    });
  }

  async deleteTransaction(id: number): Promise<void> {
    return this.request<void>(`/transactions/${id}`, { method: 'DELETE' });
  }

  async downloadTransactionsCsv(): Promise<void> {
    const headers: Record<string, string> = {};
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    const res = await fetch(`${API_BASE}/transactions/export`, { headers });
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'finpath_transactions.csv';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  // Progress Reports
  async getProgressReport(): Promise<ProgressReport> {
    return this.request<ProgressReport>('/progress');
  }

  // Settings
  async exportUserData(): Promise<Record<string, unknown>> {
    return this.request<Record<string, unknown>>('/settings/export');
  }

  async deleteAccount(): Promise<void> {
    return this.request<void>('/settings/account', { method: 'DELETE' });
  }

  // AI Assistant
  async aiBrainstorm(problem: string, customer: string) {
    return this.request<{ suggestions: Array<{ title: string; concept: string; initialCost: string; firstStep: string }>; notice: string }>(
      `/ai/brainstorm?problem=${encodeURIComponent(problem)}&customer=${encodeURIComponent(customer)}`,
      { method: 'POST' }
    );
  }

  async aiInterviewQuestions(problem: string, customer: string) {
    return this.request<{ questions: string[]; notice: string }>(
      `/ai/interview-questions?problem=${encodeURIComponent(problem)}&customer=${encodeURIComponent(customer)}`,
      { method: 'POST' }
    );
  }

  // Floating AI Chat Assistant
  async sendChatMessage(message: string, history?: { role: string; content: string }[]): Promise<ChatResponse> {
    return this.request<ChatResponse>('/chat', {
      method: 'POST',
      body: JSON.stringify({ message, history }),
    });
  }

  async getChatStatus(): Promise<ChatStatus> {
    return this.request<ChatStatus>('/chat/status');
  }

  // Admin
  async getAdminMetrics() {
    return this.request<Record<string, number>>('/admin/metrics');
  }

  async getAllOpportunitiesAdmin(): Promise<Opportunity[]> {
    return this.request<Opportunity[]>('/admin/opportunities');
  }

  async toggleOpportunityApproval(id: number): Promise<Opportunity> {
    return this.request<Opportunity>(`/admin/opportunities/${id}/approval`, { method: 'PATCH' });
  }
}

export const api = new ApiService();
