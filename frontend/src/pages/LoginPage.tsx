import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Lock, Mail, ArrowRight, Sparkles } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { login, loginAsDemoUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim() || !password) {
      setError('Please provide both email and password.');
      return;
    }

    try {
      setSubmitting(true);
      await login(email, password);
      navigate('/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid credentials. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDemoClick = async () => {
    try {
      setSubmitting(true);
      await loginAsDemoUser();
      navigate('/dashboard');
    } catch {
      setError('Unable to load demo account.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-[#FFF9F1] rounded-3xl p-8 sm:p-10 border border-[#E5D8CB] shadow-warm">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-bold text-[#49362E]">Welcome Back</h1>
          <p className="mt-2 text-sm text-[#79675E]">
            Sign in to track your financial goals and opportunity roadmaps.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-[#F4E2D9] border border-[#C74634]/30 text-xs text-[#9E3529] font-medium leading-relaxed">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="login-email" className="block text-xs font-bold text-[#49362E] uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative rounded-xl border border-[#E5D8CB] bg-white focus-within:border-[#C74634] transition-colors">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#79675E]">
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="login-email"
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
            <label htmlFor="login-password" className="block text-xs font-bold text-[#49362E] uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative rounded-xl border border-[#E5D8CB] bg-white focus-within:border-[#C74634] transition-colors">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#79675E]">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="login-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
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

          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full font-semibold text-white bg-[#C74634] hover:bg-[#9E3529] shadow-sm transition-all transform hover:-translate-y-0.5 disabled:opacity-50 text-sm mt-2"
          >
            {submitting ? 'Signing in...' : 'Sign In'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-[#E5D8CB]/80">
          <button
            type="button"
            onClick={handleDemoClick}
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-full font-semibold text-xs text-[#9E3529] bg-[#F4E2D9] hover:bg-[#E7BFA9]/60 border border-[#D9A28F] transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Quick Access Demo Account
          </button>
        </div>

        <p className="text-center text-xs text-[#79675E] mt-6">
          Don't have an account yet?{' '}
          <Link to="/register" className="font-bold text-[#C74634] hover:underline">
            Get started here
          </Link>
        </p>
      </div>
    </div>
  );
};
