import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, CheckCircle, Clock, ChevronRight, Layers, Award } from 'lucide-react';

const levelColors = {
  School: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  UG: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  PG: 'bg-purple-500/20 text-purple-400 border-purple-500/30'
};

const ModuleCard = ({ module, onClick }) => {
  const timeSpentMins = Math.round((module.timeSpent || 0) / 60);
  const masteryScore = parseFloat(module.masteryScore || 0);

  return (
    <div
      className="glass-card p-5 hover:border-emerald-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-500/10 cursor-pointer group"
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:from-emerald-500/30 group-hover:to-teal-500/30 transition-all">
          <BookOpen className="w-5 h-5 text-emerald-400" />
        </div>
        <div className="flex items-center gap-2">
          <span className={`badge border ${levelColors[module.level] || levelColors.UG}`}>
            {module.level}
          </span>
          {module.isCompleted && (
            <span className="badge-success flex items-center gap-1">
              <CheckCircle className="w-3 h-3" /> Done
            </span>
          )}
        </div>
      </div>

      {/* Topic */}
      <h3 className="font-display font-semibold text-white text-lg leading-tight mb-2 group-hover:text-emerald-300 transition-colors line-clamp-2">
        {module.topic}
      </h3>

      {/* Mastery bar */}
      {masteryScore > 0 && (
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-slate-500">Mastery</span>
            <span className="text-emerald-400 font-semibold">{masteryScore.toFixed(0)}%</span>
          </div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-1000"
              style={{ width: `${masteryScore}%` }}
            />
          </div>
        </div>
      )}

      {/* Footer stats */}
      <div className="flex items-center justify-between pt-3 border-t border-white/5">
        <div className="flex items-center gap-3 text-xs text-slate-500">
          {timeSpentMins > 0 && (
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" /> {timeSpentMins}m
            </span>
          )}
          <span className="flex items-center gap-1">
            <Layers className="w-3 h-3" />
            {new Date(module.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
      </div>
    </div>
  );
};

export default ModuleCard;