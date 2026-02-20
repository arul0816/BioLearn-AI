import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Dna, Brain, BarChart3, BookOpen, Zap, ChevronRight, ArrowRight, Shield, Globe, Award } from 'lucide-react';

const DNABackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animFrame;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    let t = 0;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const strands = 3;
      
      for (let s = 0; s < strands; s++) {
        const offsetX = (canvas.width / (strands + 1)) * (s + 1);
        const amplitude = 60;
        const frequency = 0.02;
        const spacing = 25;

        for (let y = 0; y < canvas.height; y += spacing) {
          const phase = t + s * 2 + y * frequency;
          const x1 = offsetX + Math.sin(phase) * amplitude;
          const x2 = offsetX + Math.sin(phase + Math.PI) * amplitude;
          const progress = (y % (spacing * 8)) / (spacing * 8);
          const alpha = 0.15 + Math.sin(phase * 0.5) * 0.05;

          // Left strand dot
          ctx.beginPath();
          ctx.arc(x1, y, 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(16, 185, 129, ${alpha})`;
          ctx.fill();

          // Right strand dot
          ctx.beginPath();
          ctx.arc(x2, y, 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(6, 182, 212, ${alpha})`;
          ctx.fill();

          // Cross bridge every 4 nodes
          if (y % (spacing * 4) === 0) {
            ctx.beginPath();
            ctx.moveTo(x1, y);
            ctx.lineTo(x2, y);
            ctx.strokeStyle = `rgba(34, 197, 94, ${alpha * 0.6})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
      t += 0.01;
      animFrame = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 opacity-40 pointer-events-none" />;
};

const FeatureCard = ({ icon: Icon, title, description, gradient }) => (
  <div className="glass-card p-6 hover:border-emerald-500/30 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-emerald-500/10 group">
    <div className={`w-12 h-12 ${gradient} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <h3 className="font-display font-semibold text-white text-lg mb-2">{title}</h3>
    <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
  </div>
);

const Landing = () => {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Learning',
      description: 'GPT-4 generates personalized biotechnology modules tailored to your education level—School, UG, or PG.',
      gradient: 'bg-gradient-to-br from-emerald-500 to-teal-600'
    },
    {
      icon: BookOpen,
      title: 'Adaptive Quizzes',
      description: 'Auto-generated MCQs that adapt to your performance. Easy, Medium, or Hard—always challenging you at the right level.',
      gradient: 'bg-gradient-to-br from-blue-500 to-indigo-600'
    },
    {
      icon: BarChart3,
      title: 'Smart Analytics',
      description: 'Track mastery scores, quiz performance, and time spent. Get AI-generated improvement suggestions.',
      gradient: 'bg-gradient-to-br from-purple-500 to-pink-600'
    },
    {
      icon: Zap,
      title: 'Adaptive Logic',
      description: 'Score below 50%? Get revision modules. 50-80%? Practice more. Above 80%? Unlock advanced topics.',
      gradient: 'bg-gradient-to-br from-amber-500 to-orange-600'
    }
  ];

  const stats = [
    { value: '500+', label: 'Biotech Topics' },
    { value: '3', label: 'Learning Levels' },
    { value: 'GPT-4', label: 'Powered by' },
    { value: '100%', label: 'Adaptive' }
  ];

  return (
    <div className="relative min-h-screen bg-slate-950 overflow-hidden">
      <DNABackground />
      
      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-radial from-emerald-950/50 via-transparent to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none" />

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between max-w-7xl mx-auto px-6 py-5">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <Dna className="w-6 h-6 text-white" />
          </div>
          <span className="font-display font-bold text-xl text-white">
            Bio<span className="gradient-text">Learn</span> AI
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="btn-secondary text-sm px-5 py-2.5">Sign In</Link>
          <Link to="/register" className="btn-primary text-sm px-5 py-2.5">Get Started</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-24 text-center">
        <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-2 mb-8 animate-fade-in">
          <Zap className="w-4 h-4 text-emerald-400" />
          <span className="text-emerald-400 text-sm font-medium">Powered by GPT-4 AI Technology</span>
        </div>

        <h1 className="font-display font-bold text-5xl sm:text-7xl text-white leading-tight mb-6 animate-slide-up">
          Learn Biotechnology
          <br />
          <span className="gradient-text">The Intelligent Way</span>
        </h1>

        <p className="text-slate-400 text-xl max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in">
          AI-generated learning modules, adaptive quizzes, and personalized recommendations.
          Master biotechnology from School to Postgraduate level.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in">
          <Link to="/register" className="btn-primary flex items-center gap-2 text-base px-8 py-4">
            Start Learning Free <ArrowRight className="w-5 h-5" />
          </Link>
          <Link to="/login" className="btn-secondary flex items-center gap-2 text-base px-8 py-4">
            Sign In <ChevronRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto mt-16">
          {stats.map(({ value, label }) => (
            <div key={label} className="glass-card p-4 text-center">
              <div className="font-display font-bold text-2xl gradient-text mb-1">{value}</div>
              <div className="text-slate-500 text-xs">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="font-display font-bold text-4xl text-white mb-3">
            Everything You Need to
            <span className="gradient-text"> Master Biotech</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            A complete AI-powered learning ecosystem designed for biotechnology students at every level.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map(feature => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="font-display font-bold text-4xl text-white mb-3">How BioLearn AI Works</h2>
          <p className="text-slate-400">Three simple steps to biotechnology mastery</p>
        </div>

        <div className="space-y-6">
          {[
            { step: '01', title: 'Choose Your Topic & Level', desc: 'Enter any biotechnology topic and select your academic level—School, UG, or PG.', icon: BookOpen },
            { step: '02', title: 'Get AI-Generated Content', desc: 'GPT-4 creates a structured module with introduction, core concepts, applications, and summary.', icon: Brain },
            { step: '03', title: 'Take Adaptive Quizzes', desc: 'Test your knowledge with auto-generated MCQs. The system adapts based on your performance.', icon: Zap },
          ].map(({ step, title, desc, icon: Icon }) => (
            <div key={step} className="glass-card p-6 flex items-start gap-5 hover:border-emerald-500/30 transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Icon className="w-7 h-7 text-emerald-400" />
              </div>
              <div>
                <div className="text-emerald-500 text-xs font-mono font-bold mb-1">STEP {step}</div>
                <h3 className="font-display font-semibold text-white text-xl mb-2">{title}</h3>
                <p className="text-slate-400 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 max-w-3xl mx-auto px-6 py-20 text-center">
        <div className="glass-card p-10 border-emerald-500/20 animate-pulse-glow">
          <Dna className="w-12 h-12 text-emerald-400 mx-auto mb-4 animate-float" />
          <h2 className="font-display font-bold text-4xl text-white mb-3">
            Ready to Start Learning?
          </h2>
          <p className="text-slate-400 text-lg mb-8">
            Join students mastering biotechnology with personalized AI assistance.
          </p>
          <Link to="/register" className="btn-primary inline-flex items-center gap-2 text-base px-10 py-4">
            Create Free Account <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Dna className="w-4 h-4 text-emerald-500" />
          <span className="font-display font-semibold text-white">BioLearn AI</span>
        </div>
        <p className="text-slate-600 text-sm">LLM-Based Self-Learning Biotechnology Assistant</p>
      </footer>
    </div>
  );
};

export default Landing;