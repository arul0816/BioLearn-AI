import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = ({ className = '' }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`relative w-14 h-7 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${
        isDark ? 'bg-slate-700' : 'bg-emerald-200'
      } ${className}`}
      aria-label="Toggle theme"
    >
      <div className={`absolute top-1 w-5 h-5 rounded-full transition-all duration-300 flex items-center justify-center ${
        isDark 
          ? 'left-1 bg-slate-900' 
          : 'left-8 bg-emerald-500'
      }`}>
        {isDark 
          ? <Moon className="w-3 h-3 text-slate-300" />
          : <Sun className="w-3 h-3 text-white" />
        }
      </div>
    </button>
  );
};

export default ThemeToggle;