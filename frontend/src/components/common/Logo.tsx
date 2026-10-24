import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md' }) => {
  const { isAuthenticated } = useAuth();
  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };

  const textSizes = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  return (
    <Link to={isAuthenticated ? "/dashboard" : "/"} className={`inline-flex items-center gap-2.5 group select-none ${className}`}>
      {/* FinPath Rising Path & Bar Chart Brand Mark */}
      <div className={`${iconSizes[size]} relative flex items-center justify-center rounded-lg bg-[#F4E2D9] p-1.5 border border-[#E7BFA9]/60 shadow-xs transition-transform group-hover:scale-105 duration-200`}>
        <svg viewBox="0 0 32 32" className="w-full h-full" fill="none">
          {/* Subtle ascending bars */}
          <rect x="5" y="19" width="4" height="8" rx="1.5" fill="#C74634" opacity="0.35" />
          <rect x="13" y="13" width="4" height="14" rx="1.5" fill="#C74634" opacity="0.65" />
          <rect x="21" y="7" width="4" height="20" rx="1.5" fill="#C74634" />
          {/* Rising Path line */}
          <path
            d="M4 23 L11 15 L17 19 L27 6"
            stroke="#9E3529"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="27" cy="6" r="2" fill="#C74634" />
        </svg>
      </div>

      <div className="flex flex-col leading-none">
        <span className={`font-display font-bold tracking-tight text-[#49362E] ${textSizes[size]}`}>
          Fin<span className="text-[#C74634]">Path</span>
        </span>
      </div>
    </Link>
  );
};
