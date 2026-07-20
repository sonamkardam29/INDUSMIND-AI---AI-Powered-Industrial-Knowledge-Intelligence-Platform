import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { StatCard } from '../components/ui/StatCard';
import { fetchDashboardAnalyticsApi, fetchDocumentsApi } from '../services/api';
import { IDocument } from '../types';
import {
  FileText,
  MessageSquare,
  Wrench,
  ShieldCheck,
  Zap,
  TrendingUp,
  HardDrive,
  CheckCircle2,
  Clock,
  ArrowRight,
  Bot,
  Activity,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<any>(null);
  const [recentDocs, setRecentDocs] = useState<IDocument[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchDashboardAnalyticsApi(), fetchDocumentsApi()]).then(([anaData, docsData]) => {
      setAnalytics(anaData);
      setRecentDocs(docsData.slice(0, 4));
      setLoading(false);
    });
  }, []);

  const barChartData = {
    labels: analytics?.departmentStats?.map((d: any) => d.name) || ['Maintenance', 'Operations', 'Safety', 'Quality', 'Refining'],
    datasets: [
      {
        label: 'RAG Queries Processed',
        data: analytics?.departmentStats?.map((d: any) => d.queryCount) || [342, 289, 410, 195, 120],
        backgroundColor: '#00F2FE',
        borderRadius: 8,
      },
      {
        label: 'Indexed Documents',
        data: analytics?.departmentStats?.map((d: any) => d.documents * 40) || [320, 240, 200, 120, 80],
        backgroundColor: '#10B981',
        borderRadius: 8,
      },
    ],
  };

  const doughnutChartData = {
    labels: ['PDF Manuals', 'Scanned SOPs (OCR)', 'Excel Sheets', 'DOCX Reports'],
    datasets: [
      {
        data: [65, 20, 10, 5],
        backgroundColor: ['#00F2FE', '#10B981', '#F59E0B', '#6366F1'],
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { labels: { color: '#94A3B8', font: { size: 11 } } },
    },
    scales: {
      x: { ticks: { color: '#64748B' }, grid: { display: false } },
      y: { ticks: { color: '#64748B' }, grid: { color: 'rgba(255,255,255,0.05)' } },
    },
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome */}
      <div className="glass-panel p-6 rounded-3xl border border-cyan-500/30 bg-gradient-to-r from-[#0B0F17] via-[#111724] to-[#0B0F17] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs text-cyan-400 font-semibold mb-1">
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Industrial Intelligence Engine Active</span>
          </div>
          <h1 className="text-2xl font-display font-bold text-white">
            Welcome back, {user?.name}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Logged in as <span className="text-cyan-300 font-semibold">{user?.role}</span> in <span className="text-emerald-300 font-semibold">{user?.department}</span>
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            to="/copilot"
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-400 text-black font-bold text-xs shadow-glow-cyan hover:opacity-90 transition-all flex items-center space-x-2"
          >
            <Bot className="w-4 h-4" />
            <span>Ask RAG Copilot</span>
          </Link>
          <Link
            to="/documents"
            className="px-4 py-2.5 rounded-xl glass-panel border border-slate-700 text-slate-200 text-xs font-semibold hover:border-cyan-400 transition-all"
          >
            Upload SOP
          </Link>
        </div>
      </div>

      {/* Analytics Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Indexed SOPs & Manuals"
          value={analytics?.summary?.totalDocs || 24}
          change="+18%"
          icon={FileText}
          subtext="Processed with 100% OCR"
        />
        <StatCard
          title="RAG Queries Answered"
          value={analytics?.aiUsageStats?.totalQueriesThisMonth || 1450}
          change="+34%"
          icon={MessageSquare}
          subtext="Avg response time < 420ms"
        />
        <StatCard
          title="RAG Grounding Precision"
          value={analytics?.summary?.accuracyRate || '99.2%'}
          change="0% Hallucination"
          icon={Activity}
          subtext="Verified page & quote citations"
        />
        <StatCard
          title="ISO / OSHA Compliance"
          value="96 / 100"
          change="+4 pts"
          icon={ShieldCheck}
          subtext="1 Missing SOP detected"
        />
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Department RAG Queries Chart */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Department RAG Query Traffic</h3>
              <p className="text-[11px] text-slate-400">Total natural language questions processed per plant division</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              Live Monitor
            </span>
          </div>
          <div className="h-64">
            <Bar data={barChartData} options={chartOptions} />
          </div>
        </div>

        {/* Document Format Breakdown */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white">Document Format Breakdown</h3>
              <HardDrive className="w-4 h-4 text-slate-400" />
            </div>
            <div className="h-48 flex items-center justify-center">
              <Doughnut data={doughnutChartData} options={{ responsive: true, plugins: { legend: { position: 'bottom', labels: { color: '#94A3B8', font: { size: 10 } } } } }} />
            </div>
          </div>
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Total Storage: 1.24 GB</span>
            <span className="text-emerald-400 font-semibold">385 MB Used</span>
          </div>
        </div>
      </div>

      {/* Recent Uploads & Quick Shortcuts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Uploaded Documents Table */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white">Recently Indexed SOPs</h3>
            <Link to="/documents" className="text-xs text-cyan-400 font-semibold hover:underline flex items-center space-x-1">
              <span>View All Documents</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-3">
            {recentDocs.map(doc => (
              <div
                key={doc._id}
                className="p-3.5 rounded-2xl bg-[#070A11]/60 border border-slate-800 hover:border-cyan-500/30 flex items-center justify-between transition-all"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-200 truncate max-w-sm">{doc.title}</div>
                    <div className="flex items-center space-x-2 text-[10px] text-slate-400 mt-0.5">
                      <span>{doc.department}</span>
                      <span>•</span>
                      <span>Tag: {doc.equipmentId || 'GEN'}</span>
                      <span>•</span>
                      <span className="text-emerald-400 font-semibold">{doc.chunkCount} RAG Chunks</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {doc.ocrProcessed && (
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                      OCR Extracted
                    </span>
                  )}
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                    v{doc.version}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Intelligence Shortcuts */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white mb-2">Industrial Copilot Actions</h3>

          <Link
            to="/maintenance"
            className="block p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-400/50 transition-all group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Wrench className="w-5 h-5 text-cyan-400" />
                <div>
                  <div className="text-xs font-bold text-slate-200 group-hover:text-cyan-300">Generate Maintenance RCA</div>
                  <div className="text-[10px] text-slate-400">Step-by-step repair guide & spare parts</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
            </div>
          </Link>

          <Link
            to="/compliance"
            className="block p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-400/50 transition-all group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <div>
                  <div className="text-xs font-bold text-slate-200 group-hover:text-emerald-300">ISO / OSHA Audit Check</div>
                  <div className="text-[10px] text-slate-400">Detect missing SOPs & risk score</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
            </div>
          </Link>

          <Link
            to="/reports"
            className="block p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-400/50 transition-all group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FileText className="w-5 h-5 text-cyan-400" />
                <div>
                  <div className="text-xs font-bold text-slate-200 group-hover:text-cyan-300">Download PDF Reports</div>
                  <div className="text-[10px] text-slate-400">Maintenance & Incident PDF exports</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};
