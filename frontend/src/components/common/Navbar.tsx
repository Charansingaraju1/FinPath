import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Logo } from './Logo';
import { useAuth } from '../../context/AuthContext';
import { Menu, X, LogOut, LayoutDashboard, Compass, Calculator, Map, Receipt, LineChart, Shield } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-[#F6E9D8]/95 backdrop-blur-md border-b border-[#E5D8CB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Logo size="md" />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-7">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/"
                  className={`text-sm font-medium transition-colors hover:text-[#C74634] ${
                    isActive('/') ? 'text-[#C74634] font-semibold' : 'text-[#49362E]'
                  }`}
                >
                  Home
                </Link>
                <a
                  href="/#how-it-works"
                  className="text-sm font-medium text-[#49362E] hover:text-[#C74634] transition-colors"
                >
                  How It Works
                </a>
                <a
                  href="/#features"
                  className="text-sm font-medium text-[#49362E] hover:text-[#C74634] transition-colors"
                >
                  Features
                </a>
                <Link
                  to="/services"
                  className={`text-sm font-medium transition-colors hover:text-[#C74634] ${
                    isActive('/services') ? 'text-[#C74634] font-semibold' : 'text-[#49362E]'
                  }`}
                >
                  Services
                </Link>
                <Link
                  to="/opportunities"
                  className={`text-sm font-medium transition-colors hover:text-[#C74634] ${
                    isActive('/opportunities') ? 'text-[#C74634] font-semibold' : 'text-[#49362E]'
                  }`}
                >
                  Opportunities
                </Link>
                <Link
                  to="/calculator"
                  className={`text-sm font-medium transition-colors hover:text-[#C74634] ${
                    isActive('/calculator') ? 'text-[#C74634] font-semibold' : 'text-[#49362E]'
                  }`}
                >
                  Calculator
                </Link>
                <a
                  href="/#trust"
                  className="text-sm font-medium text-[#49362E] hover:text-[#C74634] transition-colors"
                >
                  About
                </a>
              </>
            ) : (
              <>
                <Link
                  to="/dashboard"
                  className={`flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-[#C74634] ${
                    isActive('/dashboard') ? 'text-[#C74634] font-semibold' : 'text-[#49362E]'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <Link
                  to="/opportunities"
                  className={`flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-[#C74634] ${
                    isActive('/opportunities') ? 'text-[#C74634] font-semibold' : 'text-[#49362E]'
                  }`}
                >
                  <Compass className="w-4 h-4" />
                  Opportunities
                </Link>
                <Link
                  to="/roadmap"
                  className={`flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-[#C74634] ${
                    isActive('/roadmap') ? 'text-[#C74634] font-semibold' : 'text-[#49362E]'
                  }`}
                >
                  <Map className="w-4 h-4" />
                  Roadmap
                </Link>
                <Link
                  to="/calculator"
                  className={`flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-[#C74634] ${
                    isActive('/calculator') ? 'text-[#C74634] font-semibold' : 'text-[#49362E]'
                  }`}
                >
                  <Calculator className="w-4 h-4" />
                  Calculator
                </Link>
                <Link
                  to="/transactions"
                  className={`flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-[#C74634] ${
                    isActive('/transactions') ? 'text-[#C74634] font-semibold' : 'text-[#49362E]'
                  }`}
                >
                  <Receipt className="w-4 h-4" />
                  Finances
                </Link>
                <Link
                  to="/progress"
                  className={`flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-[#C74634] ${
                    isActive('/progress') ? 'text-[#C74634] font-semibold' : 'text-[#49362E]'
                  }`}
                >
                  <LineChart className="w-4 h-4" />
                  Progress
                </Link>
                {user?.role === 'ROLE_ADMIN' && (
                  <Link
                    to="/admin"
                    className={`flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-[#C74634] ${
                      isActive('/admin') ? 'text-[#C74634] font-semibold' : 'text-[#49362E]'
                    }`}
                  >
                    <Shield className="w-4 h-4" />
                    Admin
                  </Link>
                )}
              </>
            )}
          </nav>

          {/* Desktop Right Action Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  className="text-sm font-semibold text-[#49362E] hover:text-[#C74634] px-4 py-2 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-medium text-white bg-[#C74634] hover:bg-[#9E3529] px-5 py-2.5 rounded-full shadow-sm hover:shadow transition-all duration-150 transform hover:-translate-y-0.5"
                >
                  Get Started
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/settings"
                  className="flex items-center gap-2 text-sm font-medium text-[#49362E] bg-[#FFF9F1] px-3.5 py-1.5 rounded-full border border-[#E5D8CB] hover:border-[#C74634]/50 transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-[#E7BFA9] flex items-center justify-center text-[#49362E] font-semibold text-xs">
                    {user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="max-w-[120px] truncate">{user?.displayName || 'My Account'}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  title="Log out"
                  className="p-2 text-[#79675E] hover:text-[#C74634] transition-colors rounded-full hover:bg-[#F4E2D9]"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#49362E] hover:bg-[#F4E2D9] transition-colors focus:outline-hidden"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FBF5EC] border-b border-[#E5D8CB] px-4 pt-3 pb-6 space-y-3">
          {!isAuthenticated ? (
            <>
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-[#49362E] hover:bg-[#F4E2D9]"
              >
                Home
              </Link>
              <a
                href="/#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-[#49362E] hover:bg-[#F4E2D9]"
              >
                How It Works
              </a>
              <a
                href="/#features"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-[#49362E] hover:bg-[#F4E2D9]"
              >
                Features
              </a>
              <Link
                to="/opportunities"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-[#49362E] hover:bg-[#F4E2D9]"
              >
                Opportunities
              </Link>
              <Link
                to="/calculator"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-[#49362E] hover:bg-[#F4E2D9]"
              >
                Calculator
              </Link>
              <Link
                to="/services"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-[#49362E] hover:bg-[#F4E2D9]"
              >
                Services
              </Link>
              <div className="pt-4 flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-lg font-semibold text-[#49362E] bg-[#FFF9F1] border border-[#E5D8CB]"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-lg font-medium text-white bg-[#C74634]"
                >
                  Get Started
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className="px-3 py-2 text-sm font-semibold text-[#79675E] border-b border-[#E5D8CB]">
                Signed in as {user?.displayName}
              </div>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-[#49362E] hover:bg-[#F4E2D9]"
              >
                Dashboard
              </Link>
              <Link
                to="/opportunities"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-[#49362E] hover:bg-[#F4E2D9]"
              >
                Opportunities
              </Link>
              <Link
                to="/roadmap"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-[#49362E] hover:bg-[#F4E2D9]"
              >
                Roadmap
              </Link>
              <Link
                to="/calculator"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-[#49362E] hover:bg-[#F4E2D9]"
              >
                Calculator
              </Link>
              <Link
                to="/transactions"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-[#49362E] hover:bg-[#F4E2D9]"
              >
                Finances & Transactions
              </Link>
              <Link
                to="/progress"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-[#49362E] hover:bg-[#F4E2D9]"
              >
                Progress Reports
              </Link>
              <Link
                to="/settings"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-[#49362E] hover:bg-[#F4E2D9]"
              >
                Account Settings
              </Link>
              <div className="pt-2">
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-center py-2.5 rounded-lg font-medium text-white bg-[#C74634]"
                >
                  Log Out
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </header>
  );
};
