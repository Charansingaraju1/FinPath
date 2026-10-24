import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Bot, AlertTriangle, ArrowLeft } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-left space-y-10">
      {/* Back button & Breadcrumb */}
      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#79675E] hover:text-[#C74634] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>

      {/* Header */}
      <div className="border-b border-[#E5D8CB] pb-6 space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F4E2D9] text-xs font-semibold text-[#9E3529]">
          <ShieldCheck className="w-3.5 h-3.5" />
          TRANSPARENCY & DATA GOVERNANCE
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#49362E]">
          Privacy Policy
        </h1>
        <p className="text-sm text-[#79675E]">
          Last Updated: October 2026 • Effective Immediately
        </p>
      </div>

      {/* Educational Project Notice Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#FFF9F1] border-2 border-[#D9A28F] shadow-soft flex items-start gap-3.5">
        <AlertTriangle className="w-5 h-5 text-[#C74634] shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs sm:text-sm text-[#79675E] leading-relaxed">
          <strong className="text-[#49362E] font-semibold block">Educational Project Transparency Disclosure</strong>
          FinPath is an educational full-stack software project designed for personal financial planning and opportunity discovery. This Privacy Policy documents actual implemented architecture and data handling practices. If deploying this application for commercial or public use, the project owner must review and adapt these terms with legal counsel for applicable local regulations.
        </div>
      </div>

      {/* Body Content */}
      <div className="space-y-8 text-sm text-[#49362E] leading-relaxed">
        {/* Section 1 */}
        <section className="space-y-3 bg-[#FFF9F1] p-6 rounded-3xl border border-[#E5D8CB] shadow-soft">
          <h2 className="font-display text-xl font-bold text-[#49362E] flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-[#F4E2D9] text-[#C74634] text-xs flex items-center justify-center font-bold">1</span>
            Information We Collect
          </h2>
          <p className="text-xs sm:text-sm text-[#79675E]">
            FinPath collects only user-provided information required to calculate financial projections, evaluate opportunity fit, and track execution milestones:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-[#79675E]">
            <li>
              <strong className="text-[#49362E]">Account Information:</strong> Email address, cryptographically hashed password (BCrypt), and preferred display name.
            </li>
            <li>
              <strong className="text-[#49362E]">Financial Baseline Profile:</strong> Self-reported monthly take-home income, essential living expenses, discretionary spending, recurring debt repayments, current savings reserve, and available startup capital budget (all in Indian Rupees - INR).
            </li>
            <li>
              <strong className="text-[#49362E]">Skills & Time Resources:</strong> Available hours per week, experience tags, and background equipment/resources.
            </li>
            <li>
              <strong className="text-[#49362E]">Financial Goals:</strong> Goal titles, target amounts (₹), deadline dates, priority levels, and allocated savings contributions.
            </li>
            <li>
              <strong className="text-[#49362E]">Financial Transactions:</strong> Records of personal living expenses, business revenue, operating costs, and goal savings entries you log manually.
            </li>
            <li>
              <strong className="text-[#49362E]">Opportunity Research:</strong> Bookmarked catalog opportunities, user-submitted problem ideas, and qualitative customer interview notes.
            </li>
          </ul>
          <div className="p-3 bg-[#F6E9D8] rounded-xl text-xs font-semibold text-[#9E3529]">
            ⚠️ We never collect banking account numbers, debit/credit card numbers, CVVs, or UPI PINs. FinPath has no connection to your bank or financial institutions.
          </div>
        </section>

        {/* Section 2 */}
        <section className="space-y-3 bg-[#FFF9F1] p-6 rounded-3xl border border-[#E5D8CB] shadow-soft">
          <h2 className="font-display text-xl font-bold text-[#49362E] flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-[#F4E2D9] text-[#C74634] text-xs flex items-center justify-center font-bold">2</span>
            Why and How Information Is Used
          </h2>
          <p className="text-xs sm:text-sm text-[#79675E]">
            We process your data strictly to execute the deterministic calculation engine of the platform:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-[#79675E]">
            <li>Calculating your real monthly disposable surplus: <code className="bg-[#F4E2D9] px-1 py-0.5 rounded text-[#9E3529] font-mono text-xs">Income - Essential Expenses - Discretionary - Debt</code>.</li>
            <li>Assessing financial goal feasibility and calculating required monthly contributions.</li>
            <li>Generating personalized 0–100 Opportunity Fit Scores based on your startup budget and available hours.</li>
            <li>Calculating conservative, base, and optimistic break-even models in the Revenue Calculator.</li>
            <li>Sequencing custom milestone roadmaps across 3, 6, or 12 month timelines.</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="space-y-3 bg-[#FFF9F1] p-6 rounded-3xl border border-[#E5D8CB] shadow-soft">
          <h2 className="font-display text-xl font-bold text-[#49362E] flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-[#F4E2D9] text-[#C74634] text-xs flex items-center justify-center font-bold">3</span>
            Data Storage, Processing & Security
          </h2>
          <p className="text-xs sm:text-sm text-[#79675E]">
            Our server-side implementation enforces the following technical safeguards:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-[#79675E]">
            <li><strong className="text-[#49362E]">Password Hashing:</strong> Passwords are salt-hashed using BCrypt prior to database persistence. Raw passwords are never written to disk or logs.</li>
            <li><strong className="text-[#49362E]">Session Authentication:</strong> Authentication is handled via stateless JSON Web Tokens (JWT) signed with HMAC-SHA256, expiring automatically after 24 hours.</li>
            <li><strong className="text-[#49362E]">Tenant Isolation:</strong> All database queries (goals, profiles, transactions, roadmaps) enforce user ID foreign-key boundaries, preventing cross-account access.</li>
            <li><strong className="text-[#49362E]">Database Persistence:</strong> Stored within a secure relational database (H2/MySQL) hosted in isolated storage volumes.</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="space-y-3 bg-[#FFF9F1] p-6 rounded-3xl border border-[#E5D8CB] shadow-soft">
          <h2 className="font-display text-xl font-bold text-[#49362E] flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-[#F4E2D9] text-[#C74634] text-xs flex items-center justify-center font-bold">4</span>
            Third-Party Services & AI Processing Disclosures
          </h2>
          <div className="space-y-2 text-xs sm:text-sm text-[#79675E]">
            <p>
              We maintain a strict boundary regarding external artificial intelligence and analytics providers:
            </p>
            <div className="p-4 rounded-2xl bg-[#FFF9F1] border border-[#E5D8CB] space-y-2">
              <div className="font-bold text-[#49362E] flex items-center gap-2">
                <Bot className="w-4 h-4 text-[#C74634]" />
                FinPath Assistant AI Data Boundary:
              </div>
              <ul className="list-disc pl-5 space-y-1 text-xs">
                <li><strong className="text-[#49362E]">Zero Financial Profile Sharing:</strong> Your private financial profile (income, debts, expenses, transactions, goals) is <span className="text-[#C74634] font-semibold">NEVER transmitted</span> to external AI providers or language models.</li>
                <li><strong className="text-[#49362E]">Local Rule-Based Default:</strong> By default, FinPath Assistant runs locally without sending any network requests outside your application server.</li>
                <li><strong className="text-[#49362E]">Optional External AI:</strong> If an administrator configures an external AI provider (e.g., OpenAI or Google Gemini), only the specific text question entered into the chat box is transmitted. No passwords, tokens, or profile fields are attached.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 5 */}
        <section className="space-y-3 bg-[#FFF9F1] p-6 rounded-3xl border border-[#E5D8CB] shadow-soft">
          <h2 className="font-display text-xl font-bold text-[#49362E] flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-[#F4E2D9] text-[#C74634] text-xs flex items-center justify-center font-bold">5</span>
            Cookies, Local Storage & Session State
          </h2>
          <p className="text-xs sm:text-sm text-[#79675E]">
            FinPath does not use third-party tracking, advertising, or cross-site fingerprinting cookies. We use browser <code className="bg-[#F4E2D9] px-1 py-0.5 rounded text-[#9E3529] font-mono text-xs">localStorage</code> solely for operational authentication:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-[#79675E]">
            <li><code className="bg-[#F4E2D9] px-1 py-0.5 rounded text-[#9E3529] font-mono text-xs">finpath_token</code>: Your active JWT authentication bearer token.</li>
            <li><code className="bg-[#F4E2D9] px-1 py-0.5 rounded text-[#9E3529] font-mono text-xs">finpath_user</code>: Basic display information (display name, email, role).</li>
          </ul>
          <p className="text-xs text-[#79675E]">
            Both items are automatically wiped when you click <strong>Log Out</strong> or when the backend returns an expired session response (401/403).
          </p>
        </section>

        {/* Section 6 */}
        <section className="space-y-3 bg-[#FFF9F1] p-6 rounded-3xl border border-[#E5D8CB] shadow-soft">
          <h2 className="font-display text-xl font-bold text-[#49362E] flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-[#F4E2D9] text-[#C74634] text-xs flex items-center justify-center font-bold">6</span>
            Data Retention, Export & Account Deletion
          </h2>
          <p className="text-xs sm:text-sm text-[#79675E]">
            You maintain full sovereignty over your information:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-[#79675E]">
            <li><strong className="text-[#49362E]">Export Your Data:</strong> You can download a complete JSON archive of your profile, goals, transactions, and roadmaps anytime from the <Link to="/settings" className="text-[#C74634] underline font-semibold">Settings Page</Link>.</li>
            <li><strong className="text-[#49362E]">Delete Your Account:</strong> You can permanently purge your entire account and all associated records from the Settings Page via the Delete Account modal. Deletion is irreversible.</li>
          </ul>
        </section>

        {/* Section 7 */}
        <section className="space-y-3 bg-[#FFF9F1] p-6 rounded-3xl border border-[#E5D8CB] shadow-soft">
          <h2 className="font-display text-xl font-bold text-[#49362E] flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-[#F4E2D9] text-[#C74634] text-xs flex items-center justify-center font-bold">7</span>
            Contact Project Administration
          </h2>
          <p className="text-xs sm:text-sm text-[#79675E]">
            For questions regarding privacy, data removal, or open-source educational verification, please contact the project maintainer:
          </p>
          <div className="bg-[#F6E9D8] p-4 rounded-xl border border-[#E5D8CB] text-xs text-[#49362E] space-y-1">
            <div><strong>Project Administration Contact:</strong></div>
            <div>Email: <code className="text-[#C74634] font-mono">[PROJECT_OWNER_CONTACT_EMAIL] (contact@finpath.example.com)</code></div>
            <div>Repository: <code className="text-[#79675E] font-mono">FinPath Educational Full-Stack Project</code></div>
          </div>
        </section>

        {/* Section 8 */}
        <section className="space-y-2 text-xs text-[#79675E] pt-4 border-t border-[#E5D8CB]">
          <h3 className="font-bold text-[#49362E]">Updates to This Policy</h3>
          <p>
            As FinPath introduces new educational features or storage drivers, this policy will be updated with an amended "Last Updated" timestamp. We encourage users to review this page periodically.
          </p>
        </section>
      </div>
    </div>
  );
};
