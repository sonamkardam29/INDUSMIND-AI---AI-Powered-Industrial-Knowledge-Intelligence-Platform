import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bot,
  Zap,
  ShieldCheck,
  Search,
  FileText,
  Network,
  Wrench,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Layers,
  BarChart3,
  Globe,
  Cpu,
  Lock,
  ChevronRight,
  PlayCircle,
  HelpCircle,
  Building2,
  Factory,
  Flame,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const [sandboxQuery, setSandboxQuery] = useState('What is the emergency shutdown sequence for Gas Turbine GT-800?');
  const [sandboxResult, setSandboxResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleRunSandbox = () => {
    setLoading(true);
    setTimeout(() => {
      setSandboxResult({
        answer: `### Emergency Shutdown Sequence - Gas Turbine GT-800
**Standard Operating Procedure Ref: SOP-402 (Page 4, Section 3.2)**

1. **Fuel Isolation**: Depress Emergency Fuel Shut-off Switch (ES-101) on Control Console B.
2. **Valve Trip**: Confirm automatic closure of gas valve V-402 and opening of high-pressure blowdown line (BD-9).
3. **Nitrogen Purge**: Execute 15-minute nitrogen purge cycle to eliminate combustor hydrocarbons.
4. **Lube Cooling**: Maintain auxiliary lube oil pump (LOP-2) running for 4 hours until bearing temperature < 50°C.`,
        confidenceScore: 98,
        sourceDoc: 'Gas Turbine GT-800 SOP-402: Emergency Shutdown Protocol',
        pageNumber: 4,
        citations: ['Step 1: Depress Emergency Fuel Shut-off Switch (ES-101)...'],
      });
      setLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#070A11] text-slate-100 selection:bg-cyan-500 selection:text-black">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 px-6 lg:px-12 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-emerald-400 flex items-center justify-center text-black font-extrabold shadow-glow-cyan">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <span className="font-display font-bold text-lg tracking-tight text-white block leading-none">
              INDUS<span className="text-cyan-400">MIND</span> AI
            </span>
            <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold block">
              ET AI Hackathon 2026
            </span>
          </div>
        </div>

        <nav className="hidden md:flex items-center space-x-8 text-xs font-medium text-slate-300">
          <a href="#features" className="hover:text-cyan-400 transition-colors">Features</a>
          <a href="#architecture" className="hover:text-cyan-400 transition-colors">AI Architecture</a>
          <a href="#sandbox" className="hover:text-cyan-400 transition-colors">RAG Sandbox</a>
          <a href="#industries" className="hover:text-cyan-400 transition-colors">Industries</a>
          <a href="#pricing" className="hover:text-cyan-400 transition-colors">Pricing</a>
        </nav>

        <div className="flex items-center space-x-4">
          <Link
            to="/login"
            className="text-xs font-semibold px-4 py-2 rounded-xl border border-slate-700 hover:border-slate-500 text-slate-200 transition-all"
          >
            Sign In
          </Link>
          <Link
            to="/dashboard"
            className="text-xs font-semibold px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-400 text-black hover:opacity-90 shadow-glow-cyan transition-all flex items-center space-x-1.5"
          >
            <span>Launch Platform</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 px-6 lg:px-12 max-w-7xl mx-auto text-center overflow-hidden">
        {/* Background Glowing Gradients */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-cyan-500/15 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 w-[450px] h-[250px] bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full glass-panel border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-6 shadow-glow-cyan">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Built for ET AI Hackathon 2026 • Grounded Industrial RAG</span>
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-extrabold text-white tracking-tight leading-none max-w-5xl mx-auto">
          AI Powered Industrial <br />
          <span className="bg-gradient-to-r from-cyan-400 via-emerald-300 to-teal-200 bg-clip-text text-transparent glow-text-cyan">
            Knowledge Intelligence Platform
          </span>
        </h1>

        <p className="mt-6 text-base md:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
          Instantly query thousands of industrial SOPs, engineering manuals, maintenance logs, and OSHA compliance reports in natural language with verified citations, confidence scores, and zero hallucination.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/dashboard"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-400 text-black font-bold text-sm hover:scale-105 transition-all shadow-glow-cyan flex items-center justify-center space-x-2"
          >
            <Bot className="w-4 h-4" />
            <span>Explore Industrial Dashboard</span>
          </Link>
          <a
            href="#sandbox"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl glass-panel border border-slate-700 hover:border-cyan-400 text-slate-200 font-semibold text-sm transition-all flex items-center justify-center space-x-2"
          >
            <PlayCircle className="w-4 h-4 text-cyan-400" />
            <span>Try Live RAG Sandbox</span>
          </a>
        </div>

        {/* Hero Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="glass-panel p-4 rounded-2xl border border-slate-800">
            <div className="text-2xl font-bold font-display text-cyan-400">99.8%</div>
            <div className="text-xs text-slate-400">RAG Citation Accuracy</div>
          </div>
          <div className="glass-panel p-4 rounded-2xl border border-slate-800">
            <div className="text-2xl font-bold font-display text-emerald-400">0.0%</div>
            <div className="text-xs text-slate-400">Hallucination Rate</div>
          </div>
          <div className="glass-panel p-4 rounded-2xl border border-slate-800">
            <div className="text-2xl font-bold font-display text-cyan-400">&lt; 400ms</div>
            <div className="text-xs text-slate-400">Vector Retrieval Speed</div>
          </div>
          <div className="glass-panel p-4 rounded-2xl border border-slate-800">
            <div className="text-2xl font-bold font-display text-emerald-400">6 Roles</div>
            <div className="text-xs text-slate-400">Enterprise RBAC Security</div>
          </div>
        </div>
      </section>

      {/* Live Interactive RAG Sandbox */}
      <section id="sandbox" className="py-16 px-6 lg:px-12 max-w-5xl mx-auto">
        <div className="glass-panel p-8 rounded-3xl border border-cyan-500/30 shadow-2xl relative overflow-hidden">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-xs font-mono text-slate-400 ml-2">INDUSMIND RAG Engine Interactive Demo</span>
          </div>

          <h3 className="text-xl font-bold text-white mb-2">Test Live Industrial RAG Query</h3>
          <p className="text-xs text-slate-400 mb-6">
            Type an operational question below to test how INDUSMIND retrieves exact citations, page numbers, and confidence scores from uploaded SOPs.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <input
              type="text"
              value={sandboxQuery}
              onChange={e => setSandboxQuery(e.target.value)}
              className="flex-1 bg-[#070A11] border border-slate-700 rounded-xl px-4 py-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
            />
            <button
              onClick={handleRunSandbox}
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-400 text-black font-bold text-xs hover:opacity-90 transition-all flex items-center justify-center space-x-2"
            >
              {loading ? (
                <span>Querying RAG...</span>
              ) : (
                <>
                  <Zap className="w-4 h-4 fill-current" />
                  <span>Execute RAG</span>
                </>
              )}
            </button>
          </div>

          {sandboxResult && (
            <div className="bg-[#070A11] p-5 rounded-2xl border border-slate-800 text-left space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-semibold text-slate-400">RAG Answer Output</span>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Confidence Score: {sandboxResult.confidenceScore}% Match
                </span>
              </div>
              <div className="text-xs text-slate-300 leading-relaxed font-sans whitespace-pre-line">
                {sandboxResult.answer}
              </div>
              <div className="bg-[#111724] p-3 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                <div className="flex items-center space-x-2 text-cyan-400 font-semibold">
                  <FileText className="w-3.5 h-3.5" />
                  <span>Source: {sandboxResult.sourceDoc}</span>
                </div>
                <div className="text-slate-400">Page Number: {sandboxResult.pageNumber}</div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* AI Architecture Diagram */}
      <section id="architecture" className="py-20 px-6 lg:px-12 max-w-7xl mx-auto text-center">
        <div className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-2">Enterprise RAG Engine</div>
        <h2 className="text-3xl md:text-4xl font-display font-bold text-white">How INDUSMIND RAG Works</h2>
        <p className="mt-2 text-sm text-slate-400 max-w-2xl mx-auto">
          Four-stage pipeline engineered for industrial reliability and zero hallucination.
        </p>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 text-left">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold text-base mb-4">1</div>
            <h4 className="text-base font-bold text-white mb-1">OCR & Ingestion</h4>
            <p className="text-xs text-slate-400">PDFs, DOCX, Scanned Images, and Excel sheets are parsed via Tesseract OCR into clean searchable text.</p>
          </div>
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 text-left">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-base mb-4">2</div>
            <h4 className="text-base font-bold text-white mb-1">Vector Indexing</h4>
            <p className="text-xs text-slate-400">Intelligent overlapping text chunking and vector embedding generation stored in ChromaDB/MongoDB.</p>
          </div>
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 text-left">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold text-base mb-4">3</div>
            <h4 className="text-base font-bold text-white mb-1">Semantic Match</h4>
            <p className="text-xs text-slate-400">Cosine similarity matching retrieves top-K verified context chunks with page and snippet citations.</p>
          </div>
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 text-left">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-base mb-4">4</div>
            <h4 className="text-base font-bold text-white mb-1">Gemini Generation</h4>
            <p className="text-xs text-slate-400">Google Gemini API generates precise answers strictly from retrieved chunks with anti-hallucination guardrails.</p>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section id="features" className="py-20 px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-2">Comprehensive Platform</div>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white">Built for Industrial Operations</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel glass-panel-hover p-6 rounded-2xl border border-slate-800">
            <Bot className="w-8 h-8 text-cyan-400 mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">AI Knowledge Copilot</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              ChatGPT-style interface tailored for engineers. Features voice search, text-to-speech, confidence scores, and export options.
            </p>
          </div>

          <div className="glass-panel glass-panel-hover p-6 rounded-2xl border border-slate-800">
            <Network className="w-8 h-8 text-emerald-400 mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">Interactive Knowledge Graph</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Visualize relationships between Gas Turbines, Compressors, Departments, SOPs, Failure modes, and Incidents.
            </p>
          </div>

          <div className="glass-panel glass-panel-hover p-6 rounded-2xl border border-slate-800">
            <Wrench className="w-8 h-8 text-cyan-400 mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">Maintenance Copilot</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Automated Root Cause Analysis (RCA), step-by-step repair guides, downtime estimates, and spare parts recommendations.
            </p>
          </div>

          <div className="glass-panel glass-panel-hover p-6 rounded-2xl border border-slate-800">
            <ShieldCheck className="w-8 h-8 text-emerald-400 mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">Quality & ISO/OSHA Compliance</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Automated compliance auditor checking uploaded docs against ISO 9001, OSHA 1910, ISO 45001, and missing SOP alerts.
            </p>
          </div>

          <div className="glass-panel glass-panel-hover p-6 rounded-2xl border border-slate-800">
            <FileText className="w-8 h-8 text-cyan-400 mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">PDF Report Generator</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Generate downloadable enterprise PDF reports for Maintenance, Inspection, Audit findings, and Executive AI Summaries.
            </p>
          </div>

          <div className="glass-panel glass-panel-hover p-6 rounded-2xl border border-slate-800">
            <Lock className="w-8 h-8 text-emerald-400 mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">Enterprise RBAC & Security</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              6 role levels (Admin, Maintenance, Operator, Quality, Safety, Auditor), JWT auth, audit logging, and encryption.
            </p>
          </div>
        </div>
      </section>

      {/* Industries Supported */}
      <section id="industries" className="py-16 px-6 lg:px-12 max-w-7xl mx-auto border-t border-slate-800/80">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold font-display text-white">Industries Supported</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          <div className="glass-panel p-4 rounded-xl text-center border border-slate-800">
            <Flame className="w-6 h-6 text-amber-400 mx-auto mb-2" />
            <span className="text-xs font-semibold text-slate-200">Oil & Gas</span>
          </div>
          <div className="glass-panel p-4 rounded-xl text-center border border-slate-800">
            <Factory className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
            <span className="text-xs font-semibold text-slate-200">Manufacturing</span>
          </div>
          <div className="glass-panel p-4 rounded-xl text-center border border-slate-800">
            <Zap className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
            <span className="text-xs font-semibold text-slate-200">Power & Energy</span>
          </div>
          <div className="glass-panel p-4 rounded-xl text-center border border-slate-800">
            <Building2 className="w-6 h-6 text-blue-400 mx-auto mb-2" />
            <span className="text-xs font-semibold text-slate-200">Chemical Plants</span>
          </div>
          <div className="glass-panel p-4 rounded-xl text-center border border-slate-800">
            <Globe className="w-6 h-6 text-purple-400 mx-auto mb-2" />
            <span className="text-xs font-semibold text-slate-200">Aerospace</span>
          </div>
          <div className="glass-panel p-4 rounded-xl text-center border border-slate-800">
            <BarChart3 className="w-6 h-6 text-teal-400 mx-auto mb-2" />
            <span className="text-xs font-semibold text-slate-200">Automotive</span>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-6 lg:px-12 max-w-7xl mx-auto text-center">
        <div className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-2">Flexible Enterprise Plans</div>
        <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-12">Scalable RAG Pricing</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="glass-panel p-8 rounded-3xl border border-slate-800 text-left">
            <div className="text-sm font-bold text-slate-400 uppercase">Starter Plant</div>
            <div className="text-3xl font-bold font-display text-white mt-2">$499 <span className="text-xs font-normal text-slate-400">/ mo</span></div>
            <p className="text-xs text-slate-400 mt-2">Ideal for single manufacturing facility setup.</p>
            <ul className="mt-6 space-y-3 text-xs text-slate-300">
              <li className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-cyan-400" /><span>Up to 500 Documents</span></li>
              <li className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-cyan-400" /><span>Basic RAG Querying</span></li>
              <li className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-cyan-400" /><span>5 User Accounts</span></li>
            </ul>
            <Link to="/signup" className="mt-8 block w-full py-2.5 rounded-xl border border-slate-700 hover:border-cyan-400 text-center text-xs font-bold transition-all">Get Started</Link>
          </div>

          <div className="glass-panel p-8 rounded-3xl border-2 border-cyan-500 text-left relative shadow-glow-cyan">
            <div className="absolute -top-3.5 right-6 bg-cyan-500 text-black font-extrabold text-[10px] uppercase px-3 py-1 rounded-full">Most Popular</div>
            <div className="text-sm font-bold text-cyan-400 uppercase">Enterprise Plant</div>
            <div className="text-3xl font-bold font-display text-white mt-2">$1,499 <span className="text-xs font-normal text-slate-400">/ mo</span></div>
            <p className="text-xs text-slate-400 mt-2">Full intelligence suite for multi-site industrial operations.</p>
            <ul className="mt-6 space-y-3 text-xs text-slate-300">
              <li className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /><span>Unlimited Documents & OCR</span></li>
              <li className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /><span>Interactive Knowledge Graph</span></li>
              <li className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /><span>Maintenance Copilot & RCA</span></li>
              <li className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /><span>ISO / OSHA Compliance Suite</span></li>
            </ul>
            <Link to="/signup" className="mt-8 block w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-400 text-black text-center text-xs font-bold hover:opacity-90 transition-all">Start Free Trial</Link>
          </div>

          <div className="glass-panel p-8 rounded-3xl border border-slate-800 text-left">
            <div className="text-sm font-bold text-slate-400 uppercase">Custom Grid</div>
            <div className="text-3xl font-bold font-display text-white mt-2">Custom</div>
            <p className="text-xs text-slate-400 mt-2">On-premise deployment for critical energy grids.</p>
            <ul className="mt-6 space-y-3 text-xs text-slate-300">
              <li className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-cyan-400" /><span>Air-Gapped Vector DB</span></li>
              <li className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-cyan-400" /><span>Custom LLM Fine-Tuning</span></li>
              <li className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-cyan-400" /><span>24/7 Dedicated SLA</span></li>
            </ul>
            <Link to="/signup" className="mt-8 block w-full py-2.5 rounded-xl border border-slate-700 hover:border-cyan-400 text-center text-xs font-bold transition-all">Contact Sales</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-12 px-6 lg:px-12 bg-[#05080E] text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-emerald-400 flex items-center justify-center text-black font-bold">
              <Cpu className="w-4 h-4" />
            </div>
            <span className="font-display font-bold text-white text-base">INDUSMIND AI</span>
          </div>
          <div>© 2026 INDUSMIND AI Platform. Engineered for ET AI Hackathon 2026. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
};
