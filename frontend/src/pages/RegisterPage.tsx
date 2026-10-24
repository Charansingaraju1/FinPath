import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Lock, Mail, User, ArrowRight, ShieldCheck } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError('Please provide an email and password.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    try {
      setSubmitting(true);
      await register(email, password, displayName);
      navigate('/onboarding');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please check your details.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-[#FFF9F1] rounded-3xl p-8 sm:p-10 border border-[#E5D8CB] shadow-warm">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-bold text-[#49362E]">Create Your Account</h1>
          <p className="mt-2 text-sm text-[#79675E]">
            Begin your personalized financial planning and opportunity journey.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-[#F4E2D9] border border-[#C74634]/30 text-xs text-[#9E3529] font-medium leading-relaxed">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="register-displayName" className="block text-xs font-bold text-[#49362E] uppercase tracking-wider mb-1.5">
              Your Name / Display Name
            </label>
            <div className="relative rounded-xl border border-[#E5D8CB] bg-white focus-within:border-[#C74634] transition-colors">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#79675E]">
                <User className="w-4 h-4" />
              </div>
              <input
                id="register-displayName"
                name="displayName"
                type="text"
                autoComplete="name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g. Jordan Smith"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-transparent text-sm text-[#49362E] placeholder-[#79675E]/50 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label htmlFor="register-email" className="block text-xs font-bold text-[#49362E] uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative rounded-xl border border-[#E5D8CB] bg-white focus-within:border-[#C74634] transition-colors">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#79675E]">
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="register-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-transparent text-sm text-[#49362E] placeholder-[#79675E]/50 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label htmlFor="register-password" className="block text-xs font-bold text-[#49362E] uppercase tracking-wider mb-1.5">
              Password (min. 6 characters)
            </label>
            <div className="relative rounded-xl border border-[#E5D8CB] bg-white focus-within:border-[#C74634] transition-colors">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#79675E]">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="register-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-12 py-3 rounded-xl bg-transparent text-sm text-[#49362E] placeholder-[#79675E]/50 focus:outline-hidden"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#79675E] hover:text-[#49362E]"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="p-3 bg-[#F6E9D8] rounded-xl border border-[#E5D8CB] flex items-start gap-2.5 text-xs text-[#79675E]">
            <ShieldCheck className="w-4 h-4 text-[#356B4B] shrink-0 mt-0.5" />
            <span>We never ask for banking credentials or PINs. Your data is isolated and strictly confidential.</span>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full font-semibold text-white bg-[#C74634] hover:bg-[#9E3529] shadow-sm transition-all transform hover:-translate-y-0.5 disabled:opacity-50 text-sm mt-3"
          >
            {submitting ? 'Creating account...' : 'Continue to Onboarding'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-[#79675E] mt-6">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-[#C74634] hover:underline">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
};
