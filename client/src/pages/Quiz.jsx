import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import quizService from '../services/quizService';
import { 
  Brain, Sparkles, Loader, AlertCircle, CheckCircle, XCircle, 
  Trophy, ArrowRight, Clock, BarChart3, Lightbulb, RefreshCw, TrendingUp, TrendingDown
} from 'lucide-react';

const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];
const LEVELS = ['School', 'UG', 'PG'];

const QuizSetup = ({ onStart, defaultTopic, defaultLevel }) => {
  const [topic, setTopic] = useState(defaultTopic || '');
  const [level, setLevel] = useState(defaultLevel || 'UG');
  const [difficulty, setDifficulty] = useState('Medium');
  const [questionCount, setQuestionCount] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleStart = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setError('');
    try {
      const data = await quizService.generate(topic.trim(), level, difficulty, null, questionCount);
      onStart(data.quiz);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate quiz. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const difficultyColors = { Easy: 'text-emerald-400', Medium: 'text-amber-400', Hard: 'text-red-400' };
  const difficultyDesc = { Easy: 'Basic recall, definitions', Medium: 'Understanding, application', Hard: 'Analysis, problem-solving' };

  return (
    <div className="glass-card p-8 max-w-2xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <Brain className="w-6 h-6 text-blue-400" />
        <h2 className="font-display font-semibold text-white text-xl">Configure Your Quiz</h2>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-5 text-red-400 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
        </div>
      )}

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Topic</label>
          <input
            value={topic}
            onChange={e => setTopic(e.target.value)}
            placeholder="Enter a biotechnology topic..."
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-3">Level</label>
          <div className="flex gap-2">
            {LEVELS.map(l => (
              <button key={l} type="button" onClick={() => setLevel(l)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all border ${
                  level === l ? 'bg-blue-500/20 border-blue-500/60 text-blue-300' : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'
                }`}
              >{l}</button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-3">Difficulty</label>
          <div className="grid grid-cols-3 gap-2">
            {DIFFICULTIES.map(d => (
              <button key={d} type="button" onClick={() => setDifficulty(d)}
                className={`p-3 rounded-xl text-left transition-all border ${
                  difficulty === d ? `bg-white/10 border-white/30 ${difficultyColors[d]}` : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'
                }`}
              >
                <div className="font-semibold">{d}</div>
                <div className="text-xs opacity-70 mt-0.5">{difficultyDesc[d]}</div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Questions: <span className="text-white font-bold">{questionCount}</span>
          </label>
          <input
            type="range" min="5" max="20" step="5"
            value={questionCount}
            onChange={e => setQuestionCount(parseInt(e.target.value))}
            className="w-full accent-blue-500"
          />
          <div className="flex justify-between text-xs text-slate-500 mt-1"><span>5</span><span>10</span><span>15</span><span>20</span></div>
        </div>

        <button
          onClick={handleStart}
          disabled={loading || !topic.trim()}
          className="w-full py-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <><Loader className="w-5 h-5 animate-spin" /> Generating {questionCount} questions...</>
          ) : (
            <><Sparkles className="w-5 h-5" /> Generate & Start Quiz</>
          )}
        </button>
      </div>
    </div>
  );
};

const QuizActive = ({ quiz, onSubmit }) => {
  const [answers, setAnswers] = useState({});
  const [currentQ, setCurrentQ] = useState(0);
  const [startTime] = useState(Date.now());
  const [submitting, setSubmitting] = useState(false);

  const questions = quiz.questions || [];
  const current = questions[currentQ];
  const answered = Object.keys(answers).length;
  const progress = (answered / questions.length) * 100;

  const selectAnswer = (qId, option) => {
    setAnswers(prev => ({ ...prev, [qId]: option }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const timeTaken = Math.round((Date.now() - startTime) / 1000);
    try {
      const result = await quizService.submit(quiz.id, answers, timeTaken);
      onSubmit(result.results);
    } catch (err) {
      setSubmitting(false);
    }
  };

  const options = ['A', 'B', 'C', 'D'];

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress header */}
      <div className="glass-card p-4 mb-5 flex items-center gap-4">
        <div className="flex-1">
          <div className="flex items-center justify-between text-sm mb-1.5">
            <span className="text-slate-400">Question {currentQ + 1} of {questions.length}</span>
            <span className="text-slate-400">{answered} answered</span>
          </div>
          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }} />
          </div>
        </div>
        <Clock className="w-5 h-5 text-slate-500" />
      </div>

      {/* Question */}
      {current && (
        <div className="glass-card p-6 mb-4">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-slate-500 text-sm font-mono">Q{currentQ + 1}</span>
            <span className={`badge text-xs border ${
              current.difficulty === 'Hard' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
              current.difficulty === 'Easy' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
              'bg-amber-500/20 text-amber-400 border-amber-500/30'
            }`}>{current.difficulty}</span>
          </div>
          
          <p className="text-white text-lg leading-relaxed mb-6">{current.questionText}</p>
          
          <div className="space-y-2.5">
            {options.map(opt => {
              const optText = current[`option${opt}`] || current[`option${opt.toLowerCase()}`];
              const isSelected = answers[current.id] === opt;
              return (
                <button
                  key={opt}
                  onClick={() => selectAnswer(current.id, opt)}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl text-left transition-all duration-200 border ${
                    isSelected
                      ? 'bg-blue-500/20 border-blue-500/60 text-white'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20'
                  }`}
                >
                  <span className={`w-8 h-8 flex-shrink-0 rounded-lg flex items-center justify-center text-sm font-bold border ${
                    isSelected ? 'bg-blue-500 border-blue-400 text-white' : 'bg-white/10 border-white/20 text-slate-400'
                  }`}>{opt}</span>
                  <span className="text-sm">{optText}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {questions.map((q, i) => (
            <button
              key={i}
              onClick={() => setCurrentQ(i)}
              className={`w-8 h-8 flex-shrink-0 rounded-lg text-xs font-bold transition-all border ${
                currentQ === i ? 'bg-blue-500 border-blue-400 text-white' :
                answers[q.id] ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' :
                'bg-white/5 border-white/10 text-slate-500 hover:border-white/20'
              }`}
            >{i + 1}</button>
          ))}
        </div>

        {currentQ < questions.length - 1 ? (
          <button onClick={() => setCurrentQ(q => q + 1)} className="btn-secondary text-sm px-5 py-2.5 flex items-center gap-2 whitespace-nowrap">
            Next <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={submitting || answered === 0}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold px-6 py-2.5 rounded-xl transition-all flex items-center gap-2 disabled:opacity-50 whitespace-nowrap"
          >
            {submitting ? <Loader className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
            Submit Quiz
          </button>
        )}
      </div>
    </div>
  );
};

const QuizResults = ({ results, onRetry, onNewQuiz }) => {
  const { percentage, score, maxScore, grade, recommendation, questionResults, topic, difficulty } = results;
  const [showDetails, setShowDetails] = useState(false);

  const gradeColor = { A: 'text-amber-400', B: 'text-emerald-400', C: 'text-blue-400', D: 'text-orange-400' };
  const recColors = { advance: 'border-amber-500/30 bg-amber-500/10', practice: 'border-blue-500/30 bg-blue-500/10', revision: 'border-orange-500/30 bg-orange-500/10' };

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Score card */}
      <div className="glass-card p-8 text-center border-white/10">
        <div className="mb-4">
          {percentage >= 80 ? <Trophy className="w-14 h-14 text-amber-400 mx-auto animate-float" /> :
           percentage >= 50 ? <CheckCircle className="w-14 h-14 text-emerald-400 mx-auto" /> :
           <TrendingDown className="w-14 h-14 text-orange-400 mx-auto" />}
        </div>
        <div className={`font-display font-bold text-7xl mb-1 ${gradeColor[grade] || 'text-white'}`}>
          {grade}
        </div>
        <div className="text-3xl font-semibold text-white mb-2">{percentage.toFixed(1)}%</div>
        <div className="text-slate-400">{score} out of {maxScore} correct</div>
        <div className="text-sm text-slate-500 mt-1">{topic} · {difficulty}</div>
      </div>

      {/* Recommendation */}
      {recommendation && (
        <div className={`glass-card p-5 border ${recColors[recommendation.type] || 'border-white/10'}`}>
          <div className="flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-white font-medium mb-1">{recommendation.message}</p>
              <p className="text-slate-400 text-sm mb-3">{recommendation.action}</p>
              <ul className="space-y-1">
                {recommendation.details?.map((d, i) => (
                  <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                    <ArrowRight className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-slate-500" /> {d}
                  </li>
                ))}
              </ul>
              {recommendation.unlockedTopics && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {recommendation.unlockedTopics.map((t, i) => (
                    <span key={i} className="bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full px-2.5 py-0.5 text-xs">{t}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Question breakdown */}
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="btn-outline w-full flex items-center justify-center gap-2"
      >
        {showDetails ? 'Hide' : 'Show'} Question Review
      </button>

      {showDetails && questionResults && (
        <div className="space-y-3">
          {questionResults.map((q, i) => (
            <div key={i} className={`glass-card p-4 border ${q.isCorrect ? 'border-emerald-500/30' : 'border-red-500/30'}`}>
              <div className="flex items-start gap-2 mb-2">
                {q.isCorrect ? <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" /> : <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />}
                <p className="text-white text-sm">{q.questionText}</p>
              </div>
              <div className="ml-6 space-y-1 text-xs">
                {!q.isCorrect && q.userAnswer && (
                  <div className="text-red-400">Your answer: {q.userAnswer}) {q.options?.[q.userAnswer]}</div>
                )}
                <div className="text-emerald-400">Correct: {q.correctAnswer}) {q.options?.[q.correctAnswer]}</div>
                {q.explanation && <div className="text-slate-400 mt-1">{q.explanation}</div>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <button onClick={onRetry} className="btn-outline flex-1 flex items-center justify-center gap-2">
          <RefreshCw className="w-4 h-4" /> Retry Quiz
        </button>
        <button onClick={onNewQuiz} className="btn-primary flex-1 flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4" /> New Quiz
        </button>
      </div>
    </div>
  );
};

const Quiz = () => {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [phase, setPhase] = useState('setup'); // 'setup' | 'active' | 'results'
  const [quiz, setQuiz] = useState(null);
  const [results, setResults] = useState(null);
  const [lastTopic, setLastTopic] = useState(null);
  const [lastLevel, setLastLevel] = useState(null);

  const defaultTopic = searchParams.get('topic') || '';
  const defaultLevel = searchParams.get('level') || user?.level || 'UG';

  const handleStart = (quizData) => {
    setQuiz(quizData);
    setLastTopic(quizData.topic);
    setLastLevel(quizData.level);
    setPhase('active');
  };

  const handleSubmit = (resultsData) => {
    setResults(resultsData);
    setPhase('results');
  };

  const handleRetry = () => {
    setQuiz(null);
    setResults(null);
    setPhase('setup');
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-24 pb-12">
        <div className="mb-8">
          <h1 className="font-display font-bold text-3xl text-white mb-1">
            <Brain className="inline w-7 h-7 text-blue-400 mr-2" />
            Adaptive Quiz
          </h1>
          <p className="text-slate-400">AI-generated questions that adapt to your performance</p>
        </div>

        {phase === 'setup' && <QuizSetup onStart={handleStart} defaultTopic={defaultTopic} defaultLevel={defaultLevel} />}
        {phase === 'active' && quiz && <QuizActive quiz={quiz} onSubmit={handleSubmit} />}
        {phase === 'results' && results && (
          <QuizResults
            results={results}
            onRetry={() => { setPhase('setup'); }}
            onNewQuiz={() => { setQuiz(null); setResults(null); setPhase('setup'); }}
          />
        )}
      </div>
    </div>
  );
};

export default Quiz;