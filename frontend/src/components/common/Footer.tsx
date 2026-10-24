import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from './Logo';
import { ShieldCheck, HeartHandshake, Compass, ArrowUpRight } from 'lucide-react';

const CURRENT_YEAR = new Date().getFullYear();

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#F0E4D7] border-t border-[#E5D8CB] pt-16 pb-12 text-[#49362E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#E5D8CB]/80">
          {/* Brand info */}
          <div className="md:col-span-1 space-y-4">
            <Logo size="md" />
            <p className="text-sm text-[#79675E] leading-relaxed">
              Small steps. Bigger possibilities. Practical financial planning, real-world opportunity discovery, and step-by-step roadmap execution.
            </p>
            <div className="pt-2 text-xs text-[#79675E]">
              Designed for students, career changers, freelancers, and aspiring creators.
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#49362E] mb-4">Product</h4>
            <ul className="space-y-2.5 text-sm text-[#79675E]">
              <li>
                <Link to="/services" className="hover:text-[#C74634] transition-colors font-medium">
                  Services Directory
                </Link>
              </li>
              <li>
                <Link to="/opportunities" className="hover:text-[#C74634] transition-colors">
                  Problem Discovery
                </Link>
              </li>
              <li>
                <Link to="/calculator" className="hover:text-[#C74634] transition-colors">
                  Revenue Calculator
                </Link>
              </li>
              <li>
                <a href="/#how-it-works" className="hover:text-[#C74634] transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="/#roadmap" className="hover:text-[#C74634] transition-colors">
                  Milestone Roadmaps
                </a>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-[#C74634] transition-colors">
                  Financial Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Framework & Principles */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#49362E] mb-4">Approach</h4>
            <ul className="space-y-2.5 text-sm text-[#79675E]">
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#C74634]" />
                <span>Deterministic Math</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-[#C74634]" />
                <span>Evidence-Based Validation</span>
              </li>
              <li className="flex items-center gap-1.5">
                <HeartHandshake className="w-4 h-4 text-[#C74634]" />
                <span>Responsible Planning</span>
              </li>
              <li>
                <Link to="/security" className="hover:text-[#C74634] transition-colors flex items-center gap-1">
                  <span>Safeguards & Defense</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Educational Disclaimer */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#49362E] mb-4">Educational Notice</h4>
            <p className="text-xs text-[#79675E] leading-relaxed bg-[#FFF9F1] p-3.5 rounded-xl border border-[#E5D8CB]">
              FinPath is an educational financial planning and opportunity analysis platform. It does not provide certified financial advice, broker investments, or guarantee income. Users must validate customer demand before committing startup capital.
            </p>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#79675E] gap-4">
          <p>© {CURRENT_YEAR} FinPath. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-6">
            <Link to="/services" className="hover:text-[#C74634] transition-colors">
              Services
            </Link>
            <Link to="/privacy-policy" className="hover:text-[#C74634] transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms-of-service" className="hover:text-[#C74634] transition-colors">
              Terms of Service
            </Link>
            <Link to="/security" className="hover:text-[#C74634] transition-colors">
              Security Practices
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
