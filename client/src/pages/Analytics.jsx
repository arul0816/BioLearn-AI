import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import ProgressChart from '../components/ProgressChart';
import analyticsService from '../services/analyticsService';
import { 
  BarChart3, TrendingUp, Brain, Clock, Zap, Trophy, 
  Lightbulb, BookOpen, Target, RefreshCw, Sparkles
} from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, sub, color }) => (
  <div className="glass-card p-5">
    <div className="flex items-center gap-3 mb-3">
      <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <span className="text-slate-400 text-sm">{label}</span>
    </div>
    <div className="text-3xl font-display font-bold text-white">{value}</div>
    {sub && <div className="text-slate-500 text-xs mt-1">{sub}</div>}
  </div>
);

const SuggestionCard = ({ type, title, description, priority }) => {
  const typeConfig = {
    strength: { color: 'border-emerald-500/30 bg-emerald-500/5', icon: Trophy, iconColor: 'text-emerald-400' },
    weakness: { color: 'border-orange-500/30 bg-orange-500/5', icon: Target, iconColor: 'text-orange-400' },
    recommendation: { color: 'border-blue-500/30 bg-blue-500/5', icon: Lightbulb, iconColor: 'text-blue-400' },
    challenge: { color: 'border-purple-500/30 bg-purple-500/5', icon: Zap, iconColor: 'text-purple-400' },
    welcome: { color: 'border-teal-500/30 bg-teal-500/5', icon: Sparkles, iconColor: 'text-teal-400' }
  };
  const config = typeConfig[type] || typeConfig.recommendation;
  const { color, icon: Icon, iconColor } = config;

  return (
    <div className={`glass-card p-5 border ${color} transition-all hover:-translate-y-1 hover:shadow-lg duration-300`}>
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 ${iconColor} flex-shrink-0 mt-0.5`} />
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold text-white text-sm">{title}</h4>
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              priority === 'high' ? 'bg-red-500/20 text-red-400' :
              priority === 'medium' ? 'bg-amber-500/20 text-amber-400' :
              'bg-slate-500/20 text-slate-400'
            }`}>{priority}</span>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
};

const Analytics = () => {
  const [dashboard, setDashboard] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const data = await analyticsService.getDashboard();
      setDashboard(data);
    } catch (err) {
      console.error('Analytics fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSuggestions = async () => {
    setLoadingSuggestions(true);
    try {
      const data = await analyticsService.getAISuggestions();
      setSuggestions(data.suggestions || []);
    } catch (err) {
      console.error('Suggestions fetch error:', err);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  useEffect(() => {
    fetchSuggestions();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-24">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, i) => <div key={i} className="glass-card h-28 loading-shimmer" />)}
          </div>
        </div>
      </div>
    );
  }

  const { overview, quizStats, totalTimeSpentMins, recentQuizzes, topicMastery, performanceOverTime } = dashboard || {};

  const chartData = performanceOverTime?.map(d => ({
    date: d.dataValues?.date || d.date,
    avgScore: parseFloat(d.dataValues?.avgScore || d.avgScore || 0).toFixed(1)
  })) || [];

  const topicChartData = topicMastery?.map(t => ({
    topic: t.topic,
    avgMastery: parseFloat(t.dataValues?.avgMastery || t.avgMastery || 0).toFixed(1),
    attempts: parseInt(t.dataValues?.attempts || t.attempts || 0)
  })) || [];

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display font-bold text-3xl text-white mb-1">
              <BarChart3 className="inline w-7 h-7 text-purple-400 mr-2" />
              Analytics
            </h1>
            <p className="text-slate-400">Track your biotechnology learning progress</p>
          </div>
          <button onClick={fetchAnalytics} className="btn-outline text-sm flex items-center gap-2">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>

        {/* Overview stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={BookOpen} label="Modules Created" value={overview?.totalModules || 0} sub={`${overview?.moduleCompletionRate || 0}% completion`} color="bg-gradient-to-br from-emerald-500 to-teal-600" />
          <StatCard icon={Brain} label="Quizzes Taken" value={overview?.completedQuizzes || 0} sub={`${overview?.quizCompletionRate || 0}% completion`} color="bg-gradient-to-br from-blue-500 to-indigo-600" />
          <StatCard icon={TrendingUp} label="Avg Score" value={`${quizStats?.avgScore || 0}%`} sub={`Best: ${quizStats?.bestScore || 0}%`} color="bg-gradient-to-br from-purple-500 to-pink-600" />
          <StatCard icon={Clock} label="Study Time" value={`${totalTimeSpentMins || 0}m`} sub="total time spent" color="bg-gradient-to-br from-amber-500 to-orange-600" />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="glass-card p-6">
            <h3 className="font-display font-semibold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              Performance Over Time
            </h3>
            <ProgressChart type="line" data={chartData} />
          </div>

          <div className="glass-card p-6">
            <h3 className="font-display font-semibold text-white mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-400" />
              Topic Mastery
            </h3>
            <ProgressChart type="bar" data={topicChartData} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent quiz results */}
          <div className="glass-card p-6">
            <h3 className="font-display font-semibold text-white mb-4 flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-400" />
              Recent Quizzes
            </h3>
            <div className="space-y-3">
              {recentQuizzes?.length === 0 ? (
                <p className="text-slate-500 text-sm text-center py-4">No completed quizzes yet</p>
              ) : recentQuizzes?.map(q => (
                <div key={q.id} className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0">
                  <div>
                    <div className="text-white text-sm font-medium">{q.topic}</div>
                    <div className="text-slate-500 text-xs">{new Date(q.updatedAt).toLocaleDateString()}</div>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold text-lg ${
                      parseFloat(q.percentage) >= 80 ? 'text-amber-400' :
                      parseFloat(q.percentage) >= 50 ? 'text-emerald-400' : 'text-orange-400'
                    }`}>
                      {parseFloat(q.percentage || 0).toFixed(0)}%
                    </div>
                    <div className="text-slate-500 text-xs">{q.score}/{q.maxScore}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Suggestions */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                AI Suggestions
              </h3>
              <button onClick={fetchSuggestions} disabled={loadingSuggestions} className="text-xs text-slate-400 hover:text-slate-300 flex items-center gap-1">
                <RefreshCw className={`w-3.5 h-3.5 ${loadingSuggestions ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
            <div className="space-y-3">
              {loadingSuggestions ? (
                [...Array(3)].map((_, i) => <div key={i} className="glass-card h-20 loading-shimmer" />)
              ) : suggestions.length === 0 ? (
                <div className="glass-card p-6 text-center">
                  <Sparkles className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                  <p className="text-slate-500 text-sm">Complete some quizzes to get personalized suggestions!</p>
                </div>
              ) : suggestions.map((s, i) => (
                <SuggestionCard key={i} {...s} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;