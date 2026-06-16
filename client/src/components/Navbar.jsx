import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  BookOpen,
  LayoutDashboard,
  Brain,
  BarChart3,
  User,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
  Zap,
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/generate', icon: BookOpen, label: 'Learn' },
    { path: '/quiz', icon: Brain, label: 'Quiz' },
    { path: '/analytics', icon: BarChart3, label: 'Analytics' },
    { path: '/personalized-path', icon: User, label: 'Personalized Path' },
    { path: '/form.html', icon: BarChart3, label: 'Feedback', external: true },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-sky-500 rounded-xl flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-white hidden sm:block">
              Edu<span className="text-sky-400">Learn</span> AI
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map(({ path, icon: Icon, label, external }) => {
              if (external) {
                return (
                  <button
                    key={label}
                    onClick={() => (window.location.href = path)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all"
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </button>
                );
              }

              return (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive(path)
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              );
            })}
          </div>

          {/* Right section */}
          <div className="flex items-center gap-3">
            {user && (
              <div className="hidden sm:flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-amber-400 text-sm font-semibold">
                  {user.totalXp || 0} XP
                </span>
              </div>
            )}

            <button
              onClick={toggleTheme}
              className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-400 hover:text-white hover:bg-white/5"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {user && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-red-400 hover:bg-red-500/10"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            )}

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl text-slate-400 hover:text-white hover:bg-white/5"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-white/5 py-3 space-y-1">
            {navItems.map(({ path, icon: Icon, label, external }) => {
              if (external) {
                return (
                  <button
                    key={label}
                    onClick={() => {
                      window.location.href = path;
                      setMobileOpen(false);
                    }}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 w-full text-left"
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </button>
                );
              }

              return (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${
                    isActive(path)
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
