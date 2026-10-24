import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, AlertTriangle, ArrowLeft, ShieldAlert } from 'lucide-react';

export const TermsOfServicePage: React.FC = () => {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-left space-y-10">
      {/* Back button */}
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
          <FileText className="w-3.5 h-3.5" />
          USER AGREEMENT & LIMITATIONS
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#49362E]">
          Terms of Service
        </h1>
        <p className="text-sm text-[#79675E]">
          Last Updated: October 2026 • Effective for all FinPath users
        </p>
      </div>

      {/* Pre-launch Review Notice Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#FFF9F1] border-2 border-[#D9A28F] shadow-soft flex items-start gap-3.5">
        <AlertTriangle className="w-5 h-5 text-[#C74634] shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs sm:text-sm text-[#79675E] leading-relaxed">
          <strong className="text-[#49362E] font-semibold block">Notice to Project Owner & Evaluators</strong>
          This Terms of Service agreement is structured for FinPath as an educational software prototype. Before public deployment or commercial production hosting, the project administrator must insert verified legal entity details, governing jurisdiction, and registered corporate contact information.
        </div>
      </div>

      {/* Body Content */}
      <div className="space-y-8 text-sm text-[#49362E] leading-relaxed">
        {/* Section 1 */}
        <section className="space-y-3 bg-[#FFF9F1] p-6 rounded-3xl border border-[#E5D8CB] shadow-soft">
          <h2 className="font-display text-xl font-bold text-[#49362E] flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-[#F4E2D9] text-[#C74634] text-xs flex items-center justify-center font-bold">1</span>
            Acceptance of Terms & Eligibility
          </h2>
          <p className="text-xs sm:text-sm text-[#79675E]">
            By creating an account, browsing the catalog, or utilizing any financial calculation tools on FinPath, you agree to comply with and be bound by these Terms of Service. You affirm that you are at least 18 years of age (or have legal guardian permission if utilizing this software for educational purposes) and possess the legal capacity to enter into these terms.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-3 bg-[#FFF9F1] p-6 rounded-3xl border border-[#E5D8CB] shadow-soft">
          <h2 className="font-display text-xl font-bold text-[#49362E] flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-[#F4E2D9] text-[#C74634] text-xs flex items-center justify-center font-bold">2</span>
            Account Registration & Responsibilities
          </h2>
          <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-[#79675E]">
            <li>You are responsible for maintaining the confidentiality of your login credentials and password.</li>
            <li>You agree to provide true and accurate self-reported baseline figures for your financial planning.</li>
            <li>You are solely responsible for all activities occurring under your authenticated user session.</li>
            <li>If you suspect unauthorized access to your account, you agree to immediately notify the project administrator.</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="space-y-3 bg-[#FFF9F1] p-6 rounded-3xl border border-[#E5D8CB] shadow-soft">
          <h2 className="font-display text-xl font-bold text-[#49362E] flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-[#F4E2D9] text-[#C74634] text-xs flex items-center justify-center font-bold">3</span>
            Permitted & Prohibited Conduct
          </h2>
          <p className="text-xs sm:text-sm text-[#79675E]">You agree NOT to:</p>
          <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-[#79675E]">
            <li>Use FinPath for fraudulent business schemes, illegal pyramid activities, or misleading business offerings.</li>
            <li>Automate scraping or extraction of user records or catalog data without explicit written permission.</li>
            <li>Attempt to bypass JWT route authorization, access another user's isolated data, or attack the server via denial-of-service.</li>
            <li>Submit abusive, defamatory, or deceptive content through opportunity problem submission modals or interview notes.</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="space-y-3 bg-[#FFF9F1] p-6 rounded-3xl border border-[#E5D8CB] shadow-soft">
          <h2 className="font-display text-xl font-bold text-[#49362E] flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-[#F4E2D9] text-[#C74634] text-xs flex items-center justify-center font-bold">4</span>
            Opportunity Catalog & Revenue Estimates Disclaimer
          </h2>
          <div className="p-4 rounded-2xl bg-[#F6E9D8] border border-[#E5D8CB] space-y-2 text-xs sm:text-sm text-[#79675E]">
            <div className="font-bold text-[#9E3529] flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-[#C74634]" />
              CRITICAL BUSINESS & FINANCIAL DISCLAIMER:
            </div>
            <p>
              All business opportunities, difficulty ratings, startup costs (INR), fit scores, and target customer profiles in FinPath are <strong>exploratory brainstorming prompts</strong> designed to teach responsible problem discovery.
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs">
              <li>FinPath <strong>does not guarantee employment, client acquisition, revenue, or business profitability</strong>.</li>
              <li>You are solely responsible for conducting primary market research and speaking directly with prospective clients before investing personal capital.</li>
              <li>FinPath is not an investment broker, business franchisor, or employer.</li>
            </ul>
          </div>
        </section>

        {/* Section 5 */}
        <section className="space-y-3 bg-[#FFF9F1] p-6 rounded-3xl border border-[#E5D8CB] shadow-soft">
          <h2 className="font-display text-xl font-bold text-[#49362E] flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-[#F4E2D9] text-[#C74634] text-xs flex items-center justify-center font-bold">5</span>
            Financial Calculator & AI Assistant Limitations
          </h2>
          <div className="space-y-2 text-xs sm:text-sm text-[#79675E]">
            <p>
              The <strong>Revenue Calculator</strong> and <strong>Goal Planning</strong> utilities generate hypothetical mathematical models based solely on variables entered by you (price point, conversion rate, overhead, customer count):
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-[#79675E]">
              <li>Break-even customer calculations and cost recovery projections assume static conditions and do not account for market fluctuations, taxes, regulatory fees, or customer churn.</li>
              <li>The <strong>FinPath Assistant</strong> is an educational conversational guide. It does NOT provide certified financial advice, legal counsel, investment brokerage, or accounting recommendations. Always consult a qualified professional for formal financial matters.</li>
            </ul>
          </div>
        </section>

        {/* Section 6 */}
        <section className="space-y-3 bg-[#FFF9F1] p-6 rounded-3xl border border-[#E5D8CB] shadow-soft">
          <h2 className="font-display text-xl font-bold text-[#49362E] flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-[#F4E2D9] text-[#C74634] text-xs flex items-center justify-center font-bold">6</span>
            Intellectual Property
          </h2>
          <p className="text-xs sm:text-sm text-[#79675E]">
            The FinPath name, logo, visual design tokens, deterministic calculation algorithms, and platform codebase are the intellectual property of the project creators. You retain full ownership over any original notes, problem descriptions, and custom goals you submit to your private workspace.
          </p>
        </section>

        {/* Section 7 */}
        <section className="space-y-3 bg-[#FFF9F1] p-6 rounded-3xl border border-[#E5D8CB] shadow-soft">
          <h2 className="font-display text-xl font-bold text-[#49362E] flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-[#F4E2D9] text-[#C74634] text-xs flex items-center justify-center font-bold">7</span>
            Suspension, Termination & Limitation of Liability
          </h2>
          <p className="text-xs sm:text-sm text-[#79675E]">
            We reserve the right to suspend or terminate accounts that engage in system abuse, unauthorized vulnerability testing, or violation of these terms.
          </p>
          <div className="p-3 bg-[#FFF9F1] border border-[#E5D8CB] rounded-xl text-xs text-[#79675E]">
            <strong className="text-[#49362E]">Limitation of Liability:</strong> To the fullest extent permitted by applicable law, FinPath and its developers shall not be liable for any direct, indirect, incidental, or consequential losses, including financial losses, business interruption, or failed commercial endeavors resulting from the use of or inability to use this educational software.
          </div>
        </section>

        {/* Section 8 */}
        <section className="space-y-3 bg-[#FFF9F1] p-6 rounded-3xl border border-[#E5D8CB] shadow-soft">
          <h2 className="font-display text-xl font-bold text-[#49362E] flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-[#F4E2D9] text-[#C74634] text-xs flex items-center justify-center font-bold">8</span>
            Governing Law & Dispute Resolution
          </h2>
          <div className="bg-[#F6E9D8] p-4 rounded-xl border border-[#E5D8CB] text-xs text-[#49362E] space-y-1.5">
            <div><strong>Configurable Legal Placeholders (Owner Review Required):</strong></div>
            <div>Governing Jurisdiction: <code className="text-[#C74634] font-mono">[PROJECT_GOVERNING_JURISDICTION] (e.g. State of Karnataka, India)</code></div>
            <div>Dispute Venue: <code className="text-[#79675E] font-mono">[LOCAL_ARBITRATION_FORUM_PLACEHOLDER]</code></div>
            <div>Official Contact: <code className="text-[#C74634] font-mono">[PROJECT_OWNER_CONTACT_EMAIL] (contact@finpath.example.com)</code></div>
          </div>
        </section>
      </div>
    </div>
  );
};
