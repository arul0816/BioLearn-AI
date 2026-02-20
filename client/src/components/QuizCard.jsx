import React from 'react';
import { Brain, Trophy, Clock, CheckCircle, AlertCircle, XCircle, ChevronRight } from 'lucide-react';

const difficultyColors = {
  Easy: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  Medium: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  Hard: 'bg-red-500/20 text-red-400 border-red-500/30'
};

const getScoreIcon = (percentage) => {
  if (percentage >= 80) return <Trophy className="w-5 h-5 text-amber-400" />;
  if (percentage >= 50) return <CheckCircle className="w-5 h-5 text-emerald-400" />;
  return <AlertCircle className="w-5 h-5 text-orange-400" />;
};

const getScoreColor = (percentage) => {
  if (percentage >= 80) return 'text-amber-400';
  if (percentage >= 50) return 'text-emerald-400';
  return 'text-orange-400';
};

const QuizCard = ({ quiz, onClick }) => {
  const percentage = parseFloat(quiz.percentage || 0);
  const timeMins = quiz.timeTaken ? Math.round(quiz.timeTaken / 60) : null;

  return (
    <div
      className="glass-card p-5 hover:border-blue-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/10 cursor-pointer group"
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-xl flex items-center justify-center flex-shrink-0">
          <Brain className="w-5 h-5 text-blue-400" />
        </div>
        <div className="flex items-center gap-2 flex-wrap justify-end">
          <span className={`badge border ${difficultyColors[quiz.difficulty] || difficultyColors.Medium}`}>
            {quiz.difficulty}
          </span>
          {quiz.isCompleted ? (
            <span className="badge-success flex items-center gap-1">
              <CheckCircle className="w-3 h-3" /> Done
            </span>
          ) : (
            <span className="badge-warning flex items-center gap-1">
              Pending
            </span>
          )}
        </div>
      </div>

      <h3 className="font-display font-semibold text-white text-lg leading-tight mb-1 group-hover:text-blue-300 transition-colors line-clamp-2">
        {quiz.topic}
      </h3>

      {quiz.isCompleted && (
        <div className="mt-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              {getScoreIcon(percentage)}
              <span className={`text-2xl font-display font-bold ${getScoreColor(percentage)}`}>
                {percentage.toFixed(0)}%
              </span>
            </div>
            <span className="text-sm text-slate-500">
              {quiz.score}/{quiz.maxScore} correct
            </span>
          </div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${
                percentage >= 80 ? 'bg-gradient-to-r from-amber-500 to-yellow-400' :
                percentage >= 50 ? 'bg-gradient-to-r from-emerald-500 to-teal-400' :
                'bg-gradient-to-r from-orange-500 to-red-500'
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-3 mt-3 border-t border-white/5">
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span>{quiz.totalQuestions} questions</span>
          {timeMins && (
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" /> {timeMins}m
            </span>
          )}
        </div>
        <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
      </div>
    </div>
  );
};

export default QuizCard;