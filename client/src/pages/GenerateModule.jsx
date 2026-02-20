import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import moduleService from '../services/moduleService';
import { 
  BookOpen, Sparkles, ChevronDown, ChevronUp, Brain, Globe, 
  FileText, Lightbulb, CheckCircle, Loader, AlertCircle, Plus, List
} from 'lucide-react';

const LEVELS = ['School', 'UG', 'PG'];
const levelDescriptions = {
  School: 'Class 9-12, simplified language with analogies',
  UG: 'Undergraduate level, molecular mechanisms and terminology',
  PG: 'Postgraduate level, advanced concepts and current research'
};

const Section = ({ icon: Icon, title, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="glass-card overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-500/20 border border-emerald-500/30 rounded-lg flex items-center justify-center">
            <Icon className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="font-display font-semibold text-white">{title}</span>
        </div>
        {open ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
      </button>
      {open && (
        <div className="px-5 pb-5 pt-1 border-t border-white/5">
          {children}
        </div>
      )}
    </div>
  );
};

const GenerateModule = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [topic, setTopic] = useState(searchParams.get('topic') || '');
  const [level, setLevel] = useState(user?.level || 'UG');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [module, setModule] = useState(null);
  const [modules, setModules] = useState([]);
  const [view, setView] = useState('generate'); // 'generate' | 'module' | 'list'
  const [content, setContent] = useState(null);

  useEffect(() => {
    const viewId = searchParams.get('view');
    if (viewId) loadModule(viewId);
    else fetchModules();
  }, []);

  const fetchModules = async () => {
    try {
      const data = await moduleService.getAll({ limit: 20 });
      setModules(data.modules || []);
    } catch (e) {}
  };

  const loadModule = async (id) => {
    try {
      const data = await moduleService.getById(id);
      setModule(data.module);
      try {
        setContent(JSON.parse(data.module.content));
      } catch (e) {
        setContent({ introduction: data.module.introduction });
      }
      setView('module');
    } catch (e) {}
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return;
    setLoading(true);
    setError('');
    try {
      const data = await moduleService.generate(topic.trim(), level);
      setModule(data.module);
      setContent(data.module.contentParsed || JSON.parse(data.module.content || '{}'));
      setView('module');
      fetchModules();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate module. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const suggestedTopics = [
    'DNA Replication', 'CRISPR-Cas9', 'PCR Technique', 'Cell Respiration',
    'Protein Synthesis', 'Gene Expression', 'Enzyme Kinetics', 'Bioreactors'
  ];

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-24 pb-12">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display font-bold text-3xl text-white mb-1">
              <BookOpen className="inline w-7 h-7 text-emerald-400 mr-2" />
              Learning Modules
            </h1>
            <p className="text-slate-400">Generate AI-powered biotechnology learning content</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setView('generate')} className={`btn-outline text-sm px-4 py-2 ${view === 'generate' ? 'bg-emerald-500/20' : ''}`}>
              <Plus className="w-4 h-4 inline mr-1" /> Generate
            </button>
            <button onClick={() => { setView('list'); fetchModules(); }} className={`btn-outline text-sm px-4 py-2 ${view === 'list' ? 'bg-emerald-500/20' : ''}`}>
              <List className="w-4 h-4 inline mr-1" /> My Modules
            </button>
          </div>
        </div>

        {/* Generate Form */}
        {view === 'generate' && (
          <div className="glass-card p-8 mb-6">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <h2 className="font-display font-semibold text-white text-xl">Generate New Module</h2>
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-5 text-red-400 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
              </div>
            )}

            <form onSubmit={handleGenerate} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Biotechnology Topic</label>
                <input
                  type="text"
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                  placeholder="e.g., CRISPR-Cas9, DNA Replication, Gel Electrophoresis..."
                  className="input-field text-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">Learning Level</label>
                <div className="grid grid-cols-3 gap-3">
                  {LEVELS.map(l => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => setLevel(l)}
                      className={`p-4 rounded-xl text-left transition-all duration-200 border ${
                        level === l
                          ? 'bg-emerald-500/20 border-emerald-500/60 text-emerald-300'
                          : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'
                      }`}
                    >
                      <div className="font-semibold">{l}</div>
                      <div className="text-xs opacity-70 mt-1">{levelDescriptions[l]}</div>
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !topic.trim()}
                className="btn-primary w-full flex items-center justify-center gap-2 py-4 text-base"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    AI is generating your module... (may take 15-30s)
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate Learning Module
                  </>
                )}
              </button>
            </form>

            <div className="mt-5">
              <p className="text-slate-500 text-sm mb-3">Suggested topics:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedTopics.map(t => (
                  <button
                    key={t}
                    onClick={() => setTopic(t)}
                    className="bg-white/5 hover:bg-emerald-500/10 hover:text-emerald-300 hover:border-emerald-500/30 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-slate-400 transition-all"
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Module List */}
        {view === 'list' && (
          <div className="space-y-3">
            {modules.length === 0 ? (
              <div className="glass-card p-10 text-center">
                <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400">No modules yet. Generate your first one!</p>
              </div>
            ) : modules.map(m => (
              <button
                key={m.id}
                onClick={() => loadModule(m.id)}
                className="w-full glass-card p-4 text-left hover:border-emerald-500/30 transition-all flex items-center justify-between group"
              >
                <div>
                  <span className="font-medium text-white group-hover:text-emerald-300 transition-colors">{m.topic}</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="badge-info text-xs">{m.level}</span>
                    {m.isCompleted && <span className="badge-success text-xs">Completed</span>}
                    <span className="text-slate-500 text-xs">{new Date(m.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <ChevronDown className="w-5 h-5 text-slate-500 -rotate-90 group-hover:text-emerald-400 transition-colors" />
              </button>
            ))}
          </div>
        )}

        {/* Module Content */}
        {view === 'module' && module && content && (
          <div className="space-y-4">
            {/* Module header */}
            <div className="glass-card p-6 border-emerald-500/20">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="badge-info">{module.level}</span>
                    {module.isCompleted && <span className="badge-success flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Completed</span>}
                  </div>
                  <h2 className="font-display font-bold text-2xl text-white">{module.topic}</h2>
                </div>
                <button
                  onClick={() => setView('generate')}
                  className="btn-outline text-sm"
                >
                  <Plus className="w-4 h-4 inline mr-1" /> New Module
                </button>
              </div>
            </div>

            {/* Introduction */}
            {content.introduction && (
              <Section icon={FileText} title="Introduction">
                <p className="text-slate-300 leading-relaxed">{content.introduction}</p>
              </Section>
            )}

            {/* Core Concepts */}
            {content.coreConcepts && content.coreConcepts.length > 0 && (
              <Section icon={Brain} title="Core Concepts">
                <div className="space-y-4">
                  {content.coreConcepts.map((concept, i) => (
                    <div key={i} className="bg-white/5 rounded-xl p-4 border border-white/5">
                      <h4 className="font-semibold text-emerald-300 mb-2">{concept.title}</h4>
                      <p className="text-slate-300 text-sm leading-relaxed mb-3">{concept.explanation}</p>
                      {concept.keyTerms && concept.keyTerms.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {concept.keyTerms.map((term, j) => (
                            <span key={j} className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full px-2.5 py-0.5 text-xs">
                              {term}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* Diagram Explanation */}
            {content.diagramExplanation && (
              <Section icon={Lightbulb} title="Diagram & Visual Explanation">
                <p className="text-slate-300 leading-relaxed">{content.diagramExplanation}</p>
              </Section>
            )}

            {/* Real World Applications */}
            {content.realWorldApplications && content.realWorldApplications.length > 0 && (
              <Section icon={Globe} title="Real-World Applications">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {content.realWorldApplications.map((app, i) => (
                    <div key={i} className="bg-white/5 rounded-xl p-4 border border-white/5">
                      <div className="text-blue-400 font-semibold text-sm mb-1">{app.field}</div>
                      <p className="text-slate-300 text-sm mb-2">{app.application}</p>
                      {app.example && (
                        <p className="text-slate-500 text-xs italic border-l-2 border-emerald-500/40 pl-2">{app.example}</p>
                      )}
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* Summary */}
            {content.summary && (
              <Section icon={CheckCircle} title="Summary">
                <p className="text-slate-300 leading-relaxed">{content.summary}</p>
                {content.keyTakeaways && content.keyTakeaways.length > 0 && (
                  <div className="mt-4">
                    <p className="text-slate-400 text-sm font-medium mb-2">Key Takeaways:</p>
                    <ul className="space-y-1">
                      {content.keyTakeaways.map((takeaway, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                          <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                          {takeaway}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </Section>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => window.location.href = `/quiz?topic=${encodeURIComponent(module.topic)}&level=${module.level}&moduleId=${module.id}`}
                className="btn-primary flex-1 flex items-center justify-center gap-2"
              >
                <Brain className="w-5 h-5" /> Take Quiz on This Topic
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GenerateModule;