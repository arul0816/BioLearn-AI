import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import ModuleCard from '../components/ModuleCard';
import QuizCard from '../components/QuizCard';
import moduleService from '../services/moduleService';
import quizService from '../services/quizService';
import { 
  BookOpen, Brain, BarChart3, Plus, Zap, TrendingUp, 
  Clock, Trophy, ArrowRight, Sparkles, Flame
} from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, color, sub }) => (
  <div className="glass-card p-5 flex items-center gap-4">
    <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center flex-shrink-0`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <div>
      <div className="text-2xl font-display font-bold text-white">{value}</div>
      <div className="text-slate-400 text-sm">{label}</div>
      {sub && <div className="text-xs text-slate-500 mt-0.5">{sub}</div>}
    </div>
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [modules, setModules] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [modulesData, quizzesData] = await Promise.all([
          moduleService.getAll({ limit: 6 }),
          quizService.getAll({ limit: 6 })
        ]);
        setModules(modulesData.modules || []);
        setQuizzes(quizzesData.quizzes || []);
      } catch (error) {
        console.error('Dashboard fetch error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const completedModules = modules.filter(m => m.isCompleted).length;
  const completedQuizzes = quizzes.filter(q => q.isCompleted);
  const avgScore = completedQuizzes.length > 0
    ? (completedQuizzes.reduce((acc, q) => acc + parseFloat(q.percentage || 0), 0) / completedQuizzes.length).toFixed(1)
    : 0;

  const quickTopics = ['Fractions', 'Photosynthesis', 'Grammar Rules', 'World History', 'Ecosystems', 'Basic Coding'];

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-12">
        {/* Welcome header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span className="text-amber-400 text-sm font-medium">Good day!</span>
            </div>
            <h1 className="font-display font-bold text-3xl text-white">
              Welcome back, {user?.name?.split(' ')[0]}
            </h1>
            <p className="text-slate-400 mt-1">
              Level: <span className="text-emerald-400 font-medium">{user?.level}</span> • 
              {' '}<Flame className="inline w-3.5 h-3.5 text-orange-400 mx-1" />
              <span className="text-orange-400">{user?.streak || 0} day streak</span>
            </p>
          </div>
          <div className="flex gap-3">
            <Link to="/generate" className="btn-primary flex items-center gap-2 text-sm">
              <Plus className="w-4 h-4" /> New Module
            </Link>
            <Link to="/quiz" className="btn-outline flex items-center gap-2 text-sm">
              <Brain className="w-4 h-4" /> Take Quiz
            </Link>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={BookOpen} label="Modules Created" value={modules.length} color="bg-gradient-to-br from-emerald-500 to-teal-600" sub={`${completedModules} completed`} />
          <StatCard icon={Brain} label="Quizzes Taken" value={quizzes.length} color="bg-gradient-to-br from-blue-500 to-indigo-600" sub={`${completedQuizzes.length} completed`} />
          <StatCard icon={TrendingUp} label="Avg Score" value={`${avgScore}%`} color="bg-gradient-to-br from-purple-500 to-pink-600" sub="across all quizzes" />
          <StatCard icon={Zap} label="Total XP" value={user?.totalXp || 0} color="bg-gradient-to-br from-amber-500 to-orange-600" sub="experience points" />
        </div>

        {/* Quick Start */}
        <div className="glass-card p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <h2 className="font-display font-semibold text-white text-lg">Quick Start Topics</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {quickTopics.map(topic => (
              <button
                key={topic}
                onClick={() => navigate(`/generate?topic=${encodeURIComponent(topic)}`)}
                className="bg-white/5 hover:bg-emerald-500/20 hover:text-emerald-300 hover:border-emerald-500/40 border border-white/10 rounded-xl px-4 py-2 text-sm text-slate-300 transition-all duration-200"
              >
                {topic}
              </button>
            ))}
          </div>
        </div>

        {/* Recent Modules */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-white text-xl flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-400" /> Recent Modules
            </h2>
            <Link to="/generate" className="text-sm text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="glass-card p-5 h-40 loading-shimmer" />
              ))}
            </div>
          ) : modules.length === 0 ? (
            <div className="glass-card p-10 text-center">
              <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400 mb-4">No modules yet. Generate your first learning module!</p>
              <Link to="/generate" className="btn-primary inline-flex items-center gap-2 text-sm">
                <Plus className="w-4 h-4" /> Generate Module
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {modules.map(module => (
                <ModuleCard
                  key={module.id}
                  module={module}
                  onClick={() => navigate(`/generate?view=${module.id}`)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Recent Quizzes */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-white text-xl flex items-center gap-2">
              <Brain className="w-5 h-5 text-blue-400" /> Recent Quizzes
            </h2>
            <Link to="/quiz" className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="glass-card p-5 h-40 loading-shimmer" />
              ))}
            </div>
          ) : quizzes.length === 0 ? (
            <div className="glass-card p-10 text-center">
              <Brain className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400 mb-4">No quizzes yet. Test your knowledge with an adaptive quiz!</p>
              <Link to="/quiz" className="btn-outline inline-flex items-center gap-2 text-sm">
                <Brain className="w-4 h-4" /> Start Quiz
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {quizzes.map(quiz => (
                <QuizCard
                  key={quiz.id}
                  quiz={quiz}
                  onClick={() => navigate(`/quiz?view=${quiz.id}`)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;