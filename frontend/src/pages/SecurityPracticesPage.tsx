import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, Database, ArrowLeft, CheckCircle2, AlertCircle, Server, Key } from 'lucide-react';

export const SecurityPracticesPage: React.FC = () => {
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
          <ShieldCheck className="w-3.5 h-3.5" />
          SYSTEM INTEGRITY & DEFENSE
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#49362E]">
          Security Practices
        </h1>
        <p className="text-sm text-[#79675E]">
          Verified Technical Safeguards & Production Architecture Notes
        </p>
      </div>

      {/* Verification Notice */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#FFF9F1] border-2 border-[#D9A28F] shadow-soft flex items-start gap-3.5">
        <ShieldCheck className="w-5 h-5 text-[#356B4B] shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs sm:text-sm text-[#79675E] leading-relaxed">
          <strong className="text-[#49362E] font-semibold block">Factual Engineering Disclosure</strong>
          This document accurately details the security controls implemented in FinPath's codebase. We do not claim third-party certifications (such as SOC-2, ISO-27001, or PCI-DSS) that have not been formally audited. Implemented safeguards are clearly separated from production deployment recommendations below.
        </div>
      </div>

      {/* Implemented Safeguards */}
      <div className="space-y-6">
        <h2 className="font-display text-2xl font-bold text-[#49362E] flex items-center gap-2">
          <CheckCircle2 className="w-6 h-6 text-[#356B4B]" />
          Implemented Technical Safeguards
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* 1. BCrypt */}
          <div className="bg-[#FFF9F1] p-5 rounded-2xl border border-[#E5D8CB] shadow-soft space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#F4E2D9] flex items-center justify-center text-[#C74634]">
              <Key className="w-5 h-5" />
            </div>
            <h3 className="font-display text-base font-bold text-[#49362E]">
              BCrypt Password Hashing
            </h3>
            <p className="text-xs text-[#79675E] leading-relaxed">
              Passwords are salted and cryptographically hashed with BCrypt before database storage. Plaintext passwords never touch logs, storage, or application DTOs.
            </p>
            <div className="text-[10px] text-[#356B4B] font-semibold bg-[#DCE8DE] px-2 py-0.5 rounded inline-block">
              Verified in Spring Security Config
            </div>
          </div>

          {/* 2. JWT */}
          <div className="bg-[#FFF9F1] p-5 rounded-2xl border border-[#E5D8CB] shadow-soft space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#F4E2D9] flex items-center justify-center text-[#C74634]">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="font-display text-base font-bold text-[#49362E]">
              Stateless JWT Bearer Auth
            </h3>
            <p className="text-xs text-[#79675E] leading-relaxed">
              Sessions are authenticated using HMAC-SHA256 signed JSON Web Tokens expiring after 24 hours. The server does not store session cookies, eliminating session fixation vulnerabilities.
            </p>
            <div className="text-[10px] text-[#356B4B] font-semibold bg-[#DCE8DE] px-2 py-0.5 rounded inline-block">
              Verified in JwtAuthenticationFilter
            </div>
          </div>

          {/* 3. Tenant Isolation */}
          <div className="bg-[#FFF9F1] p-5 rounded-2xl border border-[#E5D8CB] shadow-soft space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#F4E2D9] flex items-center justify-center text-[#C74634]">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="font-display text-base font-bold text-[#49362E]">
              Strict Tenant Data Isolation
            </h3>
            <p className="text-xs text-[#79675E] leading-relaxed">
              Every financial goal, transaction, profile, and roadmap query scopes persistence strictly by the authenticated principal's user ID. Cross-tenant reads are prevented at the JPA repository tier.
            </p>
            <div className="text-[10px] text-[#356B4B] font-semibold bg-[#DCE8DE] px-2 py-0.5 rounded inline-block">
              Verified in JPA Repositories & Services
            </div>
          </div>

          {/* 4. Input Validation */}
          <div className="bg-[#FFF9F1] p-5 rounded-2xl border border-[#E5D8CB] shadow-soft space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#F4E2D9] flex items-center justify-center text-[#C74634]">
              <Server className="w-5 h-5" />
            </div>
            <h3 className="font-display text-base font-bold text-[#49362E]">
              Server-Side Bean Validation
            </h3>
            <p className="text-xs text-[#79675E] leading-relaxed">
              All incoming requests undergo Jakarta/Bean Validation (<code className="font-mono text-[10px]">@Valid</code>, <code className="font-mono text-[10px]">@NotNull</code>, <code className="font-mono text-[10px]">@Size</code>, <code className="font-mono text-[10px]">@Min</code>) before reaching business logic.
            </p>
            <div className="text-[10px] text-[#356B4B] font-semibold bg-[#DCE8DE] px-2 py-0.5 rounded inline-block">
              Verified in Controllers & DTOs
            </div>
          </div>

          {/* 5. Zero Banking Aggregators */}
          <div className="bg-[#FFF9F1] p-5 rounded-2xl border border-[#E5D8CB] shadow-soft space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#F4E2D9] flex items-center justify-center text-[#C74634]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-display text-base font-bold text-[#49362E]">
              Zero Banking Credentials Stored
            </h3>
            <p className="text-xs text-[#79675E] leading-relaxed">
              FinPath does not collect, store, or transmit bank account numbers, UPI PINs, CVVs, or card numbers. Because sensitive financial credentials never enter the system, the risk of banking credential leakage is completely eliminated.
            </p>
            <div className="text-[10px] text-[#356B4B] font-semibold bg-[#DCE8DE] px-2 py-0.5 rounded inline-block">
              Architectural Principle
            </div>
          </div>

          {/* 6. AI Data Isolation */}
          <div className="bg-[#FFF9F1] p-5 rounded-2xl border border-[#E5D8CB] shadow-soft space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#F4E2D9] flex items-center justify-center text-[#C74634]">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="font-display text-base font-bold text-[#49362E]">
              Strict AI Data Boundary
            </h3>
            <p className="text-xs text-[#79675E] leading-relaxed">
              Your financial goals, income, expenses, and transactions are never transmitted to external AI providers. The assistant runs on an in-memory educational rule engine, passing only user query strings if an external provider is optionally configured.
            </p>
            <div className="text-[10px] text-[#356B4B] font-semibold bg-[#DCE8DE] px-2 py-0.5 rounded inline-block">
              Verified in ChatAssistantService
            </div>
          </div>
        </div>
      </div>

      {/* Production Recommendations */}
      <div className="space-y-4 pt-4 border-t border-[#E5D8CB]">
        <h2 className="font-display text-2xl font-bold text-[#49362E] flex items-center gap-2">
          <AlertCircle className="w-6 h-6 text-[#9E3529]" />
          Production Deployment Recommendations
        </h2>
        <p className="text-xs sm:text-sm text-[#79675E] leading-relaxed">
          Before hosting FinPath in a public or multi-user cloud environment, the following infrastructure measures should be deployed:
        </p>

        <div className="bg-[#FFF9F1] p-5 rounded-2xl border border-[#E5D8CB] space-y-3 text-xs sm:text-sm text-[#79675E]">
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong className="text-[#49362E]">TLS/HTTPS Termination:</strong> Deploy behind a reverse proxy (Nginx, Cloudflare, or AWS ALB) with automated Let's Encrypt certificates to encrypt all HTTP traffic in transit.
            </li>
            <li>
              <strong className="text-[#49362E]">Secrets Management:</strong> Store the JWT signing secret and database passwords in a hardware security module or secrets manager (e.g., AWS Secrets Manager or HashiCorp Vault) rather than environment files.
            </li>
            <li>
              <strong className="text-[#49362E]">Automated Encrypted Backups:</strong> Configure daily automated snapshots of the MySQL/PostgreSQL persistent database with off-site replication.
            </li>
            <li>
              <strong className="text-[#49362E]">WAF & DDoS Mitigation:</strong> Enforce rate limiting and IP filtering at the edge proxy level to protect against automated credential stuffing.
            </li>
          </ul>
        </div>
      </div>

      {/* Reporting Vulnerabilities */}
      <div className="bg-[#F6E9D8] p-5 rounded-2xl border border-[#E5D8CB] text-xs text-[#49362E] space-y-1">
        <h3 className="font-bold text-sm">Reporting Security Concerns</h3>
        <p className="text-[#79675E] leading-relaxed">
          If you discover a security vulnerability or unexpected behavior in FinPath, please report it directly to the project administrator at <code className="text-[#C74634] font-mono">[PROJECT_OWNER_CONTACT_EMAIL] (contact@finpath.example.com)</code> before public disclosure.
        </p>
      </div>
    </div>
  );
};
